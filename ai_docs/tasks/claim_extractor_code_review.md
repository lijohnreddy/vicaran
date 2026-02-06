# ADK Agent Code Review Task: Claim Extractor

> **Purpose:** Review and address 3 potential issues in the `claim_extractor` agent implementation.

---

## 1. Task Overview

### Agent System Title
**Title:** Claim Extractor Agent - Source ID Visibility, Double-Save Risk, and Context Window

### Goal Statement
**Goal:** Ensure the claim_extractor can see source_ids from the previous agent, has no duplicate database writes, and can handle large context from detailed mode (30 sources).

---

## 2. Issues to Investigate

### Issue #1: Source ID Visibility via Session State

**Question:** Does claim_extractor automatically see the source_ids echoed by source_finder?

**Current Code (prompts.py:141-142):**
```python
**CONTEXT FROM SESSION STATE:**
Discovered Sources: {discovered_sources}
```

### 🔍 Investigation Findings:

**✅ YES - Source IDs ARE visible via SequentialAgent's session state flow.**

**How it works:**
1. `source_finder` has `output_key="discovered_sources"`
2. This saves the agent's ENTIRE output to `session_state["discovered_sources"]`
3. `claim_extractor`'s instruction uses `{discovered_sources}` placeholder
4. ADK automatically injects `session_state["discovered_sources"]` into the instruction

**With the Echo Pattern we implemented:**
- source_finder outputs: `🆔 Saved as source_id: abc-123` for each source
- This text IS part of `discovered_sources` (it's the agent's full output)
- claim_extractor sees the full text including the echoed IDs

**However, there's a UX concern:**
The current instruction says "Link to Sources" but doesn't tell the LLM HOW to find/use the source_ids in the `{discovered_sources}` text.

### 🔧 Recommended Update:

Update CLAIM_EXTRACTOR_INSTRUCTION to explicitly tell the model where to find source_ids:

```markdown
4. **Link to Sources**: Track which source(s) support each claim
   - Look for `🆔 Saved as source_id: {id}` in the discovered_sources
   - Include the source_id when calling callback_api_tool for the claim
```

---

### Issue #2: Double-Save Risk (callback_api_tool + batch_save_claims)

**Question:** Does batch_save_claims write to the DB, causing double saves?

**Current Code (claim_extractor.py:16):**
```python
after_agent_callback=batch_save_claims,
```

### 🔍 Investigation Findings:

**✅ NO DOUBLE-SAVE** - `batch_save_claims` does NOT write to the database.

**Evidence from callbacks.py:191-203:**
```python
def batch_save_claims(callback_context: CallbackContext) -> None:
    """After claim_extractor completes, store claim IDs for fact_checker.

    Note: Claims are saved via direct callback_api_tool calls during agent execution.
    This callback ensures claim_id_map is available for fact_checker.
    """
    if "claim_id_map" not in callback_context.state:
        callback_context.state["claim_id_map"] = []
    # ... debug logging only
```

**What actually happens:**
1. `callback_api_tool` saves each claim to DB → returns `claim_id`
2. `batch_save_claims` only ensures `claim_id_map` exists in session state (no DB writes)

**Same pattern as source_finder** - the callback is purely for state initialization.

**Resolution:** ✅ No change needed. No double-save occurs.

---

### Issue #3: Context Window for 30 Sources (Detailed Mode)

**Question:** Can gemini-2.5-flash handle 30 sources × 500 chars = 15k chars?

### 🔍 Investigation Findings:

**✅ SAFE** - Gemini 2.5 Flash has a 1M token context window.

**Math:**
- 30 sources × 500 chars = 15,000 characters
- At ~4 chars/token: 15,000 / 4 = ~3,750 tokens
- Gemini 2.5 Flash context: 1,048,576 tokens
- **Usage: 0.36% of context window**

**Even with additional context:**
- Instruction: ~500 tokens
- Investigation config: ~200 tokens  
- Total: ~4,500 tokens = **0.43% of context**

**No batching needed.** The model can easily handle 30+ sources.

**However**, there's a performance consideration:
- More sources = more processing time
- More sources = more tokens in/out = higher cost

**Optional optimization** (not required):
If you want to reduce token usage, you could truncate source summaries to 300 chars in detailed mode, but this isn't necessary for functionality.

---

## 3. Summary

| Issue | Status | Action Required |
|-------|--------|-----------------|
| #1: Source ID visibility in session state | ✅ Works | Optional: clarify how to find IDs in instruction |
| #2: Double-save (callback vs tool) | ✅ No issue | None (callback only inits state) |
| #3: Context window for 30 sources | ✅ Safe | None (0.43% of 1M token limit) |

---

## 4. Implementation Complete ✅

**Decisions Applied:**
- **Issue #1**: Explicit source_id linking instructions added
- **Issue #2**: Echo Pattern for claim_ids added
- **Issue #3**: Confirmed safe (no changes needed)

### Changes Made:

**[prompts.py](file:///c:/Users/Daniel Reddy/Desktop/scryb-v/apps/vicaran-agent/vicaran_agent/prompts.py)** - Updated CLAIM_EXTRACTOR_INSTRUCTION:

1. **Step 1: Read Source Summaries** - Now explicitly tells model to look for `🆔 Saved as source_id:` in `{discovered_sources}`

2. **Step 4: Link to Sources** - Updated with explicit instructions to find and use source_ids

3. **Step 5: Save via Callback** - Now includes Echo Pattern instruction

4. **New ECHO PATTERN section** - Tells model to output `🆔 Saved as claim_id: {id}` after each callback

5. **Output Format** - Updated to show source_ids and echoed claim_ids

### Data Flow Now:
```
source_finder → 🆔 source_id echoed in discovered_sources
    ↓
claim_extractor → reads source_ids, links claims, 🆔 claim_id echoed in extracted_claims
    ↓
fact_checker → reads claim_ids from extracted_claims
```
