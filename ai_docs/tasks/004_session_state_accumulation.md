# Task: Session State Accumulation for Source IDs

## 1. Task Overview

### Task Title
**Title:** Implement Session State Accumulation to Fix Source ID Data Loss

### Goal Statement
**Goal:** Fix the critical bug where `discovered_sources` only captures the final agent output instead of accumulating all source data. Implement a callback-based approach to append source information to session state as each source is processed, ensuring downstream agents (Claim Extractor, Bias Analyzer) have access to all source IDs and metadata.

---

## 2. Strategic Analysis & Solution Options

### Problem Context
The current architecture uses ADK's `output_key="discovered_sources"` which only captures the **final** LLM turn's text output. Since Source Finder processes sources across **multiple LLM turns**, only the last turn's output (summary message) is stored. This causes downstream agents to lack access to source IDs needed for proper linking.

### Solution Options Analysis

#### Option 1: Session State Accumulation via Callbacks ← CHOSEN
**Approach:** Modify `callback_api_tool` to append source metadata to a session state list after each successful SOURCE_FOUND callback.

**Pros:**
- ✅ Real-time accumulation as each source is saved
- ✅ Guarantees source data is captured (not dependent on LLM output)
- ✅ Structured data (list of dicts) vs unstructured text
- ✅ Works with ADK's existing callback patterns

**Cons:**
- ❌ Requires modifying the callback tool implementation
- ❌ Needs state access within tool context

**Implementation Complexity:** Low - Small changes to existing callback tool
**Risk Level:** Low - Additive change, doesn't break existing flow

#### Option 2: Prompt-Based Accumulation
**Approach:** Update Source Finder prompt to output all source IDs in a final structured summary.

**Pros:**
- ✅ No code changes needed
- ✅ Works with existing `output_key` mechanism

**Cons:**
- ❌ Relies on LLM following instructions correctly
- ❌ LLM could miss sources or format incorrectly
- ❌ Unstructured text requires parsing

**Implementation Complexity:** Low
**Risk Level:** High - LLM reliability issues

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Session State Accumulation via Callbacks

**Why this is the best choice:**
1. **Guaranteed data capture** - Callback happens after each DB save, so data is reliable
2. **Structured format** - List of dicts is easier for downstream agents to parse
3. **No LLM dependency** - Works regardless of how LLM structures its output
4. **Clean architecture** - Follows ADK patterns for state management

---

## 3. Current State Analysis

### Technology & Architecture
- **Agent Framework:** Google ADK (Agent Development Kit)
- **State Management:** ADK Session State (`session.state`)
- **Tool Pattern:** `callback_api_tool` for all data persistence
- **Current Issue:** `output_key` only captures final LLM turn

### Current State
The `discovered_sources` session variable contains only:
```
"⚠️ SKIPPED: https://... ✅ **All 12 sources analyzed!**..."
```

Instead of the expected accumulated data:
```
Source 1: title=X, source_id=abc-123, credibility=5
Source 2: title=Y, source_id=def-456, credibility=4
...
```

---

## 4. Problem Statement

### Problem Statement
Downstream agents (Claim Extractor, Bias Analyzer) read `{discovered_sources}` from session state expecting to find source IDs. However, `discovered_sources` only contains the final LLM turn's output (a summary message), not the accumulated list of all sources with their IDs.

### Success Criteria
- [ ] `discovered_sources` contains structured data for ALL processed sources
- [ ] Each source entry includes: `source_id`, `title`, `url`, `credibility_score`, `key_claims`
- [ ] Claim Extractor can parse source IDs from session state
- [ ] Bias Analyzer can find source IDs for per-source analysis

---

## 5. Development Mode Context

- **🚨 IMPORTANT: This is an active development agent**
- **No backwards compatibility concerns** - Session state structure can change
- **Aggressive refactoring allowed** - Can modify callback tool freely

---

## 6. Technical Requirements

### Functional Requirements
- [ ] `callback_api_tool` appends source metadata to session state list on SOURCE_FOUND
- [ ] Each entry contains: source_id, title, url, credibility_score, key_claims, summary
- [ ] Session state key `sources_accumulated` stores the list (separate from LLM output)
- [ ] Downstream agent prompts updated to read from `{sources_accumulated}`

### Non-Functional Requirements
- **Performance:** No blocking - append operation is O(1)
- **Reliability:** Must capture 100% of saved sources

---

## 7. Code Changes Overview

### 📂 **Current Implementation (Before)**

**`tools/callback_api.py`:**
```python
def callback_api_tool(callback_type: str, data: dict, ...) -> dict:
    # Makes HTTP call to save data
    response = httpx.post(...)
    return {"success": True, "source_id": response.json()["source_id"]}
    # ❌ Does NOT update session state
```

**Downstream prompts:**
```python
CLAIM_EXTRACTOR_INSTRUCTION = """
Discovered Sources: {discovered_sources}  # ❌ Only contains final output
"""
```

### 📂 **After Refactor**

**`tools/callback_api.py`:**
```python
def callback_api_tool(callback_type: str, data: dict, tool_context, ...) -> dict:
    response = httpx.post(...)
    result = response.json()
    
    # ✅ Accumulate to session state
    if callback_type == "SOURCE_FOUND":
        sources_list = tool_context.state.get("sources_accumulated", [])
        sources_list.append({
            "source_id": result["source_id"],
            "title": data.get("title"),
            "url": data.get("url"),
            "credibility_score": data.get("credibility_score"),
            "key_claims": data.get("key_claims", []),
        })
        tool_context.state["sources_accumulated"] = sources_list
    
    return {"success": True, "source_id": result["source_id"]}
```

**Downstream prompts:**
```python
CLAIM_EXTRACTOR_INSTRUCTION = """
Accumulated Sources: {sources_accumulated}  # ✅ Structured list of all sources
"""
```

### 🎯 **Key Changes Summary**
- [ ] **Change 1:** Add session state accumulation in `callback_api_tool` for SOURCE_FOUND
- [ ] **Change 2:** Add session state accumulation for CLAIM_EXTRACTED (for fact_checker)
- [ ] **Change 3:** Initialize `sources_accumulated` and `claims_accumulated` in state initialization
- [ ] **Change 4:** Update CLAIM_EXTRACTOR_INSTRUCTION to use `{sources_accumulated}`
- [ ] **Change 5:** Update FACT_CHECKER_INSTRUCTION to use `{claims_accumulated}`
- [ ] **Change 6:** Update BIAS_ANALYZER_INSTRUCTION to use `{sources_accumulated}`
- [ ] **Files Modified:** 
  - `tools/callback_api.py`
  - `callbacks.py`
  - `prompts.py`

---

## 8. Implementation Plan

### Phase 1: State Initialization
**Goal:** Add new accumulation keys to session state

- [ ] **Task 1.1:** Update `initialize_investigation_state` in callbacks.py
  - Files: `vicaran_agent/callbacks.py`
  - Details: Add `sources_accumulated = []` and `claims_accumulated = []`

### Phase 2: Callback Tool Enhancement
**Goal:** Accumulate data on each callback

- [ ] **Task 2.1:** Modify `callback_api_tool` to append source data
  - Files: `vicaran_agent/tools/callback_api.py`
  - Details: On SOURCE_FOUND, append to `sources_accumulated` list
- [ ] **Task 2.2:** Modify `callback_api_tool` to append claim data
  - Files: `vicaran_agent/tools/callback_api.py`
  - Details: On CLAIM_EXTRACTED, append to `claims_accumulated` list

### Phase 3: Prompt Updates
**Goal:** Update downstream agent prompts to use accumulated data

- [ ] **Task 3.1:** Update CLAIM_EXTRACTOR_INSTRUCTION
  - Files: `vicaran_agent/prompts.py`
  - Details: Change `{discovered_sources}` to `{sources_accumulated}`
- [ ] **Task 3.2:** Update FACT_CHECKER_INSTRUCTION
  - Files: `vicaran_agent/prompts.py`
  - Details: Change `{extracted_claims}` to `{claims_accumulated}`
- [ ] **Task 3.3:** Update BIAS_ANALYZER_INSTRUCTION
  - Files: `vicaran_agent/prompts.py`
  - Details: Change `{discovered_sources}` to `{sources_accumulated}`
- [ ] **Task 3.4:** Update SUMMARY_WRITER_INSTRUCTION
  - Files: `vicaran_agent/prompts.py`
  - Details: Use `{sources_accumulated}`, `{claims_accumulated}` for structured data access

### Phase 4: Testing
**Goal:** Verify the fix works end-to-end

- [ ] **Task 4.1:** Restart ADK agent
  - Command: Restart `npm run adk:web`
- [ ] **Task 4.2:** Run test investigation
  - Details: Run "investigate Anthropic AI quick mode" and check session state
- [ ] **Task 4.3:** Verify session state contains accumulated sources
  - Details: Check that `sources_accumulated` contains all source IDs

---

## 9. Task Completion Tracking

### Phase 1: State Initialization
- [x] **Task 1.1:** Update `initialize_investigation_state` ✓ 2026-02-07

### Phase 2: Callback Tool Enhancement
- [x] **Task 2.1:** Modify callback for SOURCE_FOUND ✓ 2026-02-07
- [x] **Task 2.2:** Modify callback for CLAIM_EXTRACTED ✓ 2026-02-07

### Phase 3: Prompt Updates
- [x] **Task 3.1:** Update CLAIM_EXTRACTOR_INSTRUCTION ✓ 2026-02-07
- [x] **Task 3.2:** Update FACT_CHECKER_INSTRUCTION ✓ 2026-02-07
- [x] **Task 3.3:** Update BIAS_ANALYZER_INSTRUCTION ✓ 2026-02-07
- [x] **Task 3.4:** Update SUMMARY_WRITER_INSTRUCTION ✓ 2026-02-07
- [x] **Task 3.5:** Update TIMELINE_BUILDER_INSTRUCTION ✓ 2026-02-07

### Phase 4: Testing
- [ ] **Task 4.1:** Restart ADK agent
- [ ] **Task 4.2:** Run test investigation
- [ ] **Task 4.3:** Verify accumulated sources

---

## 10. Potential Issues

### Error Scenarios to Analyze
- [ ] **Error Scenario 1:** Tool context doesn't have state access
  - **Mitigation:** Check ADK ToolContext documentation for state access pattern
- [ ] **Error Scenario 2:** State not persisting between tool calls
  - **Mitigation:** Verify state is being set correctly, check ADK logs

### Edge Cases
- [ ] **Edge Case 1:** Source callback fails after Jina succeeds
  - **Handling:** Only append on successful callback response
- [ ] **Edge Case 2:** Duplicate source URLs
  - **Handling:** current behavior is fine (source_id is unique anyway)
