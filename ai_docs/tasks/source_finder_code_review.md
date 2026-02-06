# ADK Agent Code Review Task: Source Finder

> **Purpose:** Review and address 3 potential issues in the `source_finder` agent implementation.

---

## 1. Task Overview

### Agent System Title
**Title:** Source Finder Agent - Content Fetching, Duplicate Saves, and Workflow Clarity

### Goal Statement
**Goal:** Ensure the source_finder agent can generate meaningful summaries from actual article content, has no duplicate database writes, and has clear workflow instructions that prevent LLM hallucination.

---

## 2. Issues to Investigate

### Issue #1: Missing Content Fetching Tool (jina_reader_tool)

**Question:** Since tavily_search_tool only returns 500-char snippets, how can the agent generate real summaries?

**Current Code (source_finder.py:15):**
```python
tools=[tavily_search_tool, callback_api_tool],
```

**Current Instruction (prompts.py:80-84):**
```
1. **Search for Sources**: Use tavily_search_tool to find relevant sources
2. **Analyze & Summarize**:
   - Generate 2-3 sentence summary (max 500 chars)
   - Extract 1-3 key claims from this source
   - Assess credibility (1-5 stars based on domain + content quality)
```

### 🔍 Investigation Findings:

**⚠️ CONFIRMED ISSUE** - The agent cannot fetch full article content.

**Evidence:**
1. **tavily_search_tool returns only snippets** (line 57): `"content": item.get("content", "")[:500]`
2. **jina_reader_tool EXISTS** at `tools/jina_reader.py` - fully implemented with blocked content detection
3. **jina_reader_tool is NOT in tools list** - agent cannot call it
4. **Result**: Agent would hallucinate summaries from 500-char search snippets

### 🚨 Recommended Fix:

**Add jina_reader_tool to the source_finder tools list:**

```python
from ..tools import callback_api_tool, tavily_search_tool, jina_reader_tool

source_finder = LlmAgent(
    name="source_finder",
    model="gemini-2.5-flash",
    instruction=SOURCE_FINDER_INSTRUCTION,
    tools=[tavily_search_tool, jina_reader_tool, callback_api_tool],  # Add jina_reader_tool
    after_agent_callback=batch_save_sources,
    output_key="discovered_sources",
    description="Discovers additional sources via web search based on investigation brief",
)
```

---

### Issue #2: Duplicate Source Saves (callback_api_tool + batch_save_sources)

**Question:** Won't sources be saved twice - once by callback_api_tool and again by batch_save_sources?

**Current Code (source_finder.py:15-16):**
```python
tools=[tavily_search_tool, callback_api_tool],
after_agent_callback=batch_save_sources,
```

### 🔍 Investigation Findings:

**✅ NO DUPLICATE SAVES** - `batch_save_sources` does NOT write to the database.

**Evidence from callbacks.py:174-188:**
```python
def batch_save_sources(callback_context: CallbackContext) -> None:
    """After source_finder completes, store source IDs for downstream agents.

    Note: Sources are saved via direct callback_api_tool calls during agent execution.
    This callback captures the results and stores source_id_map.
    """
    # Source IDs are accumulated during agent execution via callback_api_tool
    # Just ensure the map is available
    if "source_id_map" not in callback_context.state:
        callback_context.state["source_id_map"] = []
    # ... debug logging only
```

**What actually happens:**
1. `callback_api_tool` saves each source to DB → returns `source_id`
2. `batch_save_sources` only ensures `source_id_map` exists in session state (no DB writes)

**Resolution:** ✅ No change needed. The callback is purely for state initialization, not DB writes.

---

### Issue #3: Missing "Fetch Content" Step in Workflow

**Question:** Does the LLM know it needs to call jina_reader_tool before analyzing?

**Current Instruction Flow:**
```
1. **Search for Sources**: Use tavily_search_tool to find relevant sources
2. **Analyze & Summarize**: Generate 2-3 sentence summary...
```

### 🔍 Investigation Findings:

**⚠️ CONFIRMED ISSUE** - No explicit "Fetch Content" step exists.

**Current Risk:**
- LLM searches with Tavily → gets URLs + snippets
- LLM immediately tries to "analyze & summarize" from snippets
- Result: Hallucinated summaries not grounded in actual article content

### 🚨 Recommended Fix:

**Update SOURCE_FINDER_INSTRUCTION to add explicit fetch step:**

```markdown
For EACH source you find or analyze:

1. **Search for Sources**: Use tavily_search_tool to find relevant sources
2. **Fetch Full Content**: Use jina_reader_tool on each URL to get article text
   - If jina_reader_tool returns `is_reachable: false`, mark source as BLOCKED and skip
   - Only proceed with analysis if you have actual content
3. **Analyze & Summarize** (ONLY if content was fetched):
   - Generate 2-3 sentence summary (max 500 chars) FROM THE FETCHED CONTENT
   - Extract 1-3 key claims from this source
   - Assess credibility (1-5 stars based on domain + content quality)
4. **Stream to User**: Output in this EXACT format...
5. **Save via Callback**: Call callback_api_tool...
```

---

## 3. Summary

| Issue | Status | Action Required |
|-------|--------|-----------------|
| #1: jina_reader_tool not in tools list | ⚠️ Missing | **Add tool to source_finder.py** |
| #2: Duplicate source saves | ✅ No issue | None (callback only inits state) |
| #3: Missing "Fetch Content" step | ⚠️ Missing | **Update prompts.py instruction** |

---

## 4. Follow-Up Questions Analysis

### Follow-Up #1: How does source_id get into source_id_map?

**Question:** If callback_api_tool returns source_id, but batch_save_sources just inits an empty list, how does the ID actually get stored?

### 🔍 Investigation Findings:

**⚠️ GAP IDENTIFIED** - There is NO mechanism to store source_id in session state!

**Current flow:**
1. LLM calls `callback_api_tool` → API returns `{"success": true, "source_id": "uuid-123"}`
2. The return value goes back to the LLM as tool output
3. LLM sees the response but doesn't store it
4. `batch_save_sources` only initializes empty `source_id_map = []`
5. **Result**: `source_id_map` remains empty, downstream agents have no source IDs!

**Code evidence from callback_api.py:66-67:**
```python
# API returns created IDs: source_id, claim_id, fact_check_id, event_id
return {"success": True, **result}
# ❌ The ID is returned but NOT stored in tool_context.state!
```

### 🚨 Recommended Fix:

**Update callback_api_tool to store IDs in session state:**

```python
# After getting response from API
if callback_type == "SOURCE_FOUND" and result.get("source_id"):
    # Ensure map exists
    if "source_id_map" not in tool_context.state:
        tool_context.state["source_id_map"] = []
    # Append the new source ID with URL for reference
    tool_context.state["source_id_map"].append({
        "source_id": result["source_id"],
        "url": data.get("url", ""),
    })
```

This way, each `SOURCE_FOUND` callback automatically populates the map - no LLM involvement needed.

---

### Follow-Up #2: What to do when Jina returns blocked/403 content?

**Question:** Should the agent skip blocked sources entirely, or fall back to Tavily snippets?

### Options:

**Option A: Skip Entirely (Recommended)**
- If `is_reachable: false`, mark source as BLOCKED and skip completely
- Don't save to DB, don't count toward source limits
- Cleanest approach - no low-quality summaries

**Option B: Fallback to Snippet**
- If Jina fails, use the 500-char Tavily snippet for a minimal summary
- Risk: LLM might still hallucinate details not in snippet
- Mark with lower credibility score (⭐⭐ max)

**Option C: Hybrid**
- Skip for 403/blocked errors (paywall, login required)
- Fallback for transient errors (timeout, rate limit)

**Current jina_reader.py behavior** (already implemented):
```python
# Returns is_reachable: false for blocked content
return {
    "success": False,
    "is_reachable": False,
    "error": "Content blocked or unavailable",
    "content": "",
}
```

---

## 6. Implementation Complete ✅

**Decisions Applied:**
- **Echo Pattern** for ID storage (stateless tool, LLM echoes source_id in output)
- **Option A: Skip Entirely** for blocked content

### Changes Made:

1. **[source_finder.py](file:///c:/Users/Daniel Reddy/Desktop/scryb-v/apps/vicaran-agent/vicaran_agent/sub_agents/source_finder.py)**:
   - Added `jina_reader_tool` to imports and tools list

2. **[prompts.py](file:///c:/Users/Daniel Reddy/Desktop/scryb-v/apps/vicaran-agent/vicaran_agent/prompts.py)** - Updated SOURCE_FINDER_INSTRUCTION:
   - Added explicit **Step 2: Fetch Full Content** using jina_reader_tool
   - Added **BLOCKED CONTENT HANDLING** section (skip if `is_reachable: false`)
   - Added **ECHO PATTERN FOR IDs** section (LLM outputs source_id after callback)
   - Renumbered steps: Search → Fetch → Analyze → Stream → Save
   - Added skipped count to final summary output

### New Workflow:
```
1. Search (tavily) → URLs + snippets
2. Fetch (jina) → Full content OR is_reachable:false
3. If blocked → SKIP, output "⚠️ SKIPPED"
4. If reachable → Analyze & Summarize from ACTUAL content
5. Stream to user → Visual progress
6. Save (callback) → Echo source_id in output
```
