# ADK Agent Code Review Task: Fact Checker

> **Purpose:** Review and address 3 potential issues in the `fact_checker` agent implementation.

---

## 1. Task Overview

### Agent System Title
**Title:** Fact Checker Agent - Content Fetching, Claim ID Echo Pattern, and Callback Necessity

### Goal Statement
**Goal:** Ensure the fact_checker can verify claims with sufficient evidence context, properly uses claim_ids from the Echo Pattern, and has no unnecessary callbacks.

---

## 2. Issues to Investigate

### Issue #1: Should we add jina_reader_tool for evidence verification?

**Question:** To verify specific statistics (like "300% increase"), does the model need full article text or are snippets sufficient?

**Current Code (fact_checker.py:15):**
```python
tools=[tavily_search_tool, callback_api_tool],
```

### 🔍 Investigation Findings:

**⚠️ DECISION REQUIRED** - This is a trade-off between accuracy and speed/cost.

**Current behavior:**
- `tavily_search_tool` returns 500-char snippets + a synthesized "answer"
- Model uses snippets to make verification decisions

**Arguments FOR adding jina_reader_tool:**
- Full article context for nuanced verification
- Ability to check surrounding context for statistics
- More thorough fact-checking

**Arguments AGAINST (for MVP):**
- Tavily's advanced search includes an "answer" field with synthesis
- Fact-checker already has access to `{discovered_sources}` which contains summaries
- Adding jina_reader = more API calls = slower + costlier
- Pro model (gemini-2.5-pro) is good at reasoning from limited context

**Recommendation for MVP:** Keep as-is (no jina_reader). The Pro model + Tavily snippets + already-gathered source summaries should be sufficient. We can add jina_reader in a post-MVP iteration if verification quality is insufficient.

---

### Issue #2: Claim ID Echo Pattern Not Implemented

**Question:** Does the instruction tell the model to extract and use claim_id from `{extracted_claims}`?

**Current Instruction (prompts.py:227-236):**
```markdown
For EACH claim:

1. **Gather Evidence**: Use tavily_search_tool to find corroborating or contradicting evidence
2. **Analyze Evidence**: Compare claim against all available evidence
3. **Assign Verdict**: Choose from: VERIFIED, PARTIALLY TRUE, FALSE, UNVERIFIED
4. **Save via Callback**: Call callback_api_tool with type="FACT_CHECKED" with verdict and evidence
```

### 🔍 Investigation Findings:

**⚠️ CONFIRMED ISSUE** - The instruction does NOT tell the model to:
1. Extract claim_id from `🆔 Saved as claim_id:` in `{extracted_claims}`
2. Include claim_id when calling callback_api_tool

**Risk:** The model may send `claim_text` instead of `claim_id` to the callback API, causing database errors or orphaned fact checks.

### 🚨 Recommended Fix:

Update FACT_CHECKER_INSTRUCTION to:
1. Tell model where to find claim_ids in `{extracted_claims}`
2. Require claim_id when calling callback_api_tool
3. Apply Echo Pattern for fact_check_id

---

### Issue #3: Is batch_save_fact_checks Callback Necessary?

**Question:** Does any downstream agent read from a fact_check_results map, or just the text output?

**Current callback (callbacks.py:206-213):**
```python
def batch_save_fact_checks(callback_context: CallbackContext) -> None:
    """After fact_checker completes, log the fact check results."""
    debug_mode = os.getenv("DEBUG_MODE", "false").lower() == "true"
    if debug_mode:
        print(f"\n📦 BATCH SAVE FACT CHECKS: Complete")
```

### 🔍 Investigation Findings:

**✅ CALLBACK CAN BE REMOVED** - It only logs, and downstream doesn't need a map.

**Evidence:**
1. The callback does **nothing** except debug logging
2. `summary_writer` reads `{fact_check_results}` which comes from `output_key="fact_check_results"`
3. `output_key` saves the **text output** of fact_checker, not a structured map
4. Summary writer doesn't need a `fact_check_id_map` - it just reads the text verdicts

**Data flow:**
```
fact_checker output → saved to session_state["fact_check_results"] via output_key
                   → summary_writer reads {fact_check_results} placeholder
```

**Recommendation:** Remove `after_agent_callback=batch_save_fact_checks` to simplify code.

---

## 3. Summary

| Issue | Status | Action Required |
|-------|--------|-----------------|
| #1: Add jina_reader_tool for verification | 🤔 Trade-off | **Decision needed** (recommend: skip for MVP) |
| #2: Claim ID Echo Pattern missing | ⚠️ Missing | **Update instruction** |
| #3: batch_save_fact_checks unnecessary | ✅ Removable | **Remove callback** (optional cleanup) |

---

## 4. Implementation Complete ✅

**Decisions Applied:**
- **Issue #1 (jina_reader)**: Skipped for MVP ✓
- **Issue #2 (claim_id Echo Pattern)**: Implemented ✓
- **Issue #3 (batch_save_fact_checks)**: Removed ✓

### Changes Made:

1. **[prompts.py](file:///c:/Users/Daniel Reddy/Desktop/scryb-v/apps/vicaran-agent/vicaran_agent/prompts.py)** - Updated FACT_CHECKER_INSTRUCTION:
   - Added **Step 1: Extract Claim ID** - tells model to find `🆔 Saved as claim_id:` in `{extracted_claims}`
   - Updated **Step 5: Save via Callback** - requires claim_id, echoes fact_check_id
   - Added **ECHO PATTERN section** - outputs `🆔 Saved as fact_check_id: {id}`
   - Updated **Output Format** - shows claim_id and echoed fact_check_id

2. **[fact_checker.py](file:///c:/Users/Daniel Reddy/Desktop/scryb-v/apps/vicaran-agent/vicaran_agent/sub_agents/fact_checker.py)**:
   - Removed `batch_save_fact_checks` import
   - Removed `after_agent_callback=batch_save_fact_checks`

### Data Flow Now:
```
claim_extractor → 🆔 claim_id echoed in extracted_claims
    ↓
fact_checker → reads claim_ids, verifies claims, 🆔 fact_check_id echoed in fact_check_results
    ↓
summary_writer → reads {fact_check_results} text output
```
