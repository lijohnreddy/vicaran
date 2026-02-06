# ADK Agent Code Review Task: Timeline Builder

> **Purpose:** Review and address 2 potential issues in the `timeline_builder` agent implementation.

---

## 1. Task Overview

### Agent System Title
**Title:** Timeline Builder Agent - Callback Necessity and JSON Schema in Prompt

### Goal Statement
**Goal:** Simplify the timeline_builder by removing unnecessary callbacks and ensure the model knows the exact JSON schema for callback_api_tool.

---

## 2. Issues to Investigate

### Issue #1: Can we remove batch_save_timeline_events?

**Question:** Does any downstream agent require a structured timeline_event_map, or can we delete the callback?

**Current Code (timeline_builder.py:17):**
```python
after_agent_callback=batch_save_timeline_events,
```

### 🔍 Investigation Findings:

**✅ CALLBACK CAN BE REMOVED** - It only checks for skip marker and logs.

**Evidence from callbacks.py:231-244:**
```python
def batch_save_timeline_events(callback_context: CallbackContext) -> None:
    """Save timeline events, but skip if agent returned TIMELINE_SKIPPED."""
    timeline_output = callback_context.state.get("timeline_events", "")

    # Detect skip marker - no DB writes needed
    if "[TIMELINE_SKIPPED]" in timeline_output:
        # ... just logs "Quick Search mode"
        return  # Nothing to save

    # ... just logs "Complete"
```

**What the callback does:**
1. Checks for `[TIMELINE_SKIPPED]` marker
2. Logs debug output
3. **Does NOT write to database**
4. **Does NOT populate any map**

**Who reads timeline_events?**
- `summary_writer` reads `{timeline_events}` from session state
- This is the **text output** (via `output_key="timeline_events"`), not a structured map

**Recommendation:** Remove `batch_save_timeline_events` to keep architecture clean.

---

### Issue #2: JSON Schema Missing from Prompt

**Question:** How will the model know the required fields (event_date, event_text, etc.) for callback_api_tool?

**Current Instruction (prompts.py:361):**
```markdown
5. **Save via Callback**: Call callback_api_tool with type="TIMELINE_EVENT" for each event
```

### 🔍 Investigation Findings:

**⚠️ CONFIRMED ISSUE** - No JSON schema is provided.

**Current behavior:**
- Model is told to call callback_api_tool with type="TIMELINE_EVENT"
- No fields specified (event_date, event_text, source_ids, etc.)
- Model may invent field names or miss required fields
- Risk: API validation errors

### 🚨 Recommended Fix:

Update TIMELINE_BUILDER_INSTRUCTION to include explicit JSON schema:

```markdown
5. **Save via Callback**: Call callback_api_tool with type="TIMELINE_EVENT"
   - **Required fields:**
     - `event_date`: ISO format date string (YYYY-MM-DD)
     - `event_text`: Description of what happened
     - `source_ids`: List of source_ids that mention this event
   - **ECHO the returned event_id in your output**
```

Also apply the Echo Pattern for consistency with other agents.

---

## 3. Summary

| Issue | Status | Action Required |
|-------|--------|-----------------|
| #1: batch_save_timeline_events unnecessary | ✅ Removable | **Remove callback** |
| #2: JSON schema missing from prompt | ⚠️ Missing | **Add schema + Echo Pattern** |

---

## 4. Implementation Complete ✅

**Decisions Applied:**
- **Issue #1**: Removed `batch_save_timeline_events` callback ✓
- **Issue #2**: Added JSON schema + Echo Pattern ✓

### Changes Made:

1. **[prompts.py](file:///c:/Users/Daniel Reddy/Desktop/scryb-v/apps/vicaran-agent/vicaran_agent/prompts.py)** - Updated TIMELINE_BUILDER_INSTRUCTION:
   - Added **Step 4: Link Sources** - instructions to find source_id from Echo Pattern
   - Added **Step 5: Save via Callback** with explicit JSON schema:
     - `event_date`: ISO format (YYYY-MM-DD)
     - `event_text`: Description (max 200 chars)
     - `source_ids`: List of source_ids
   - Added **ECHO PATTERN section** - outputs `🆔 Saved as event_id: {id}`
   - Updated **Output Format** with event_id column

2. **[timeline_builder.py](file:///c:/Users/Daniel Reddy/Desktop/scryb-v/apps/vicaran-agent/vicaran_agent/sub_agents/timeline_builder.py)**:
   - Removed `batch_save_timeline_events` import
   - Removed `after_agent_callback=batch_save_timeline_events`

### Data Flow Now:
```
source_finder → 🆔 source_id → discovered_sources
    ↓
claim_extractor → 🆔 claim_id → extracted_claims
    ↓
fact_checker → 🆔 fact_check_id → fact_check_results
    ↓
timeline_builder → 🆔 event_id → timeline_events
    ↓
summary_writer → reads all text outputs
```
