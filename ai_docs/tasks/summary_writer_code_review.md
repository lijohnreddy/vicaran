# ADK Agent Code Review Task: Summary Writer

> **Purpose:** Review and address 3 potential issues in the `summary_writer` agent implementation.

---

## 1. Task Overview

### Agent System Title
**Title:** Summary Writer Agent - Callback vs Output Key, Context Window, and Investigation ID

### Goal Statement
**Goal:** Clarify the summary persistence mechanism, confirm context window capacity, and verify investigation_id handling.

---

## 2. Issues to Investigate

### Issue #1: Callback vs Output Key for Summary Persistence

**Question:** Since output_key saves the text to session state, do we need the model to call callback_api_tool with the full summary as a JSON argument?

**Current Instruction (prompts.py:447):**
```markdown
**Save via Callback**: Call callback_api_tool with type="INVESTIGATION_COMPLETE" with the full summary
```

**Current Callback (callbacks.py:247-264):**
```python
def save_final_summary(callback_context: CallbackContext) -> None:
    """After summary_writer completes, save the investigation summary."""
    investigation_summary = callback_context.state.get("investigation_summary", "")
    investigation_id = callback_context.state.get("investigation_id")

    if not investigation_id or not investigation_summary:
        return

    # Check for completion marker
    if "[INVESTIGATION_COMPLETE]" not in investigation_summary:
        return  # Not complete yet

    # ... just logs
```

### 🔍 Investigation Findings:

**⚠️ ARCHITECTURE MISMATCH** - Two competing patterns for saving the summary.

**Current behavior has TWO paths:**
1. **LLM calls callback_api_tool** with type="INVESTIGATION_COMPLETE" + full summary as JSON
2. **save_final_summary callback** reads from `session_state["investigation_summary"]` (via output_key)

**Problems with Pattern 1 (tool call):**
- Large summary (potentially 5k+ chars) packed into JSON argument
- Risk of JSON parsing errors with special characters/markdown
- Redundant - the text is already captured by output_key

**Pattern 2 (callback reading output_key) is cleaner:**
- Summary already saved to session state via `output_key="investigation_summary"`
- Callback can read it cleanly from `callback_context.state`
- BUT: Current callback only logs, doesn't actually send to API!

### 🚨 Recommended Fix:

**Option A: Remove callback_api_tool call from instruction**
- Keep the callback but enhance it to make the HTTP call directly
- This is the pattern we used for `pipeline_started_callback`
- Model just outputs the summary, callback handles persistence

**Option B: Keep tool call but remove callback**
- Let the model call callback_api_tool with the summary
- Remove the redundant save_final_summary callback

**Recommendation: Option A** - More deterministic, avoids JSON issues with large text.

---

### Issue #2: Context Window for Detailed Mode

**Question:** Can gemini-2.5-pro hold all previous agent outputs at once (30 sources, claims, fact checks, timeline)?

### 🔍 Investigation Findings:

**✅ SAFE** - Gemini 2.5 Pro has a 1M token context window.

**Worst-case calculation for Detailed Mode:**
- discovered_sources: 30 × 500 chars = 15,000 chars
- extracted_claims: 30 claims × 200 chars = 6,000 chars
- fact_check_results: 30 verdicts × 300 chars = 9,000 chars
- bias_analysis: ~500 chars
- timeline_events: 20 events × 100 chars = 2,000 chars
- investigation_config: ~200 chars
- Instruction: ~1,500 chars

**Total: ~34,200 chars ≈ 8,550 tokens**

**Usage: 0.8% of 1M token context window**

**Confirmed:** The model being used is `gemini-2.5-pro` (line 13 of summary_writer.py), which has a 1M token context. No issues.

---

### Issue #3: Investigation ID Handling

**Question:** Does the model need to include investigation_id in the callback_api_tool call?

### 🔍 Investigation Findings:

**✅ NO ACTION NEEDED** - Investigation ID is handled automatically.

**Evidence from callback_api.py:30-33:**
```python
# Get investigation_id from session state
investigation_id = tool_context.state.get("investigation_id")
if not investigation_id:
    return {"success": False, "error": "No investigation_id in session state"}
```

**How it works:**
1. `investigation_id` is set in session state at pipeline start
2. `callback_api_tool` reads it from `tool_context.state` automatically
3. The API payload includes it: `{"type": "...", "investigation_id": investigation_id, "data": data}`

The model does NOT need to specify investigation_id - it's handled transparently.

---

## 3. Summary

| Issue | Status | Action Required |
|-------|--------|-----------------|
| #1: Callback vs Tool for summary | ⚠️ Mismatch | **Decision needed** (Option A recommended) |
| #2: Context window for detailed mode | ✅ Safe | None (0.8% of 1M token limit) |
| #3: Investigation ID handling | ✅ Auto-handled | None (tool reads from session state) |

---

## 4. Implementation Complete ✅

**Decisions Applied:**
- **Issue #1**: Option A (Callback-Based Persistence) ✓
- **Issue #2**: Confirmed safe (0.8% of 1M tokens) ✓
- **Issue #3**: Confirmed auto-handled ✓

### Changes Made:

1. **[prompts.py](file:///c:/Users/Daniel Reddy/Desktop/scryb-v/apps/vicaran-agent/vicaran_agent/prompts.py)** - Updated SUMMARY_WRITER_INSTRUCTION:
   - Removed "Save via Callback" instruction
   - Added "Do NOT call callback_api_tool for the summary"
   - Added "The system will automatically save your summary via a callback"

2. **[callbacks.py](file:///c:/Users/Daniel Reddy/Desktop/scryb-v/apps/vicaran-agent/vicaran_agent/callbacks.py)** - Enhanced save_final_summary:
   - Added direct HTTP POST to API (same pattern as pipeline_started_callback)
   - Reads summary from session state (via output_key)
   - Sends INVESTIGATION_COMPLETE with summary in payload

3. **[summary_writer.py](file:///c:/Users/Daniel Reddy/Desktop/scryb-v/apps/vicaran-agent/vicaran_agent/sub_agents/summary_writer.py)**:
   - Removed `callback_api_tool` from tools list
   - Added comment: "No tools needed - callback handles persistence"

### Benefits:
- **Cleaner architecture**: Model just outputs text, callback handles persistence
- **No JSON issues**: Large summary strings stay in session state, not JSON args
- **Deterministic**: HTTP call happens in callback, not dependent on LLM tool call
