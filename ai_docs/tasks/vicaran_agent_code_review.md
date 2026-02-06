# ADK Agent Code Review Task

> **Purpose:** Review and address 4 potential issues identified in the Vicaran agent implementation.

---

## 1. Task Overview

### Agent System Title
**Title:** Vicaran Agent Code Review - Parameter Names, Import Shadowing, and Model Validation

### Goal Statement
**Goal:** Systematically investigate 4 identified concerns in `agent.py` and `prompts.py` to ensure the Vicaran investigation agent works correctly without silent failures or hidden bugs.

---

## 2. Issues to Investigate

### Issue #1: SequentialAgent Parameter Name

**Question:** Does `SequentialAgent` accept `sub_agents` or should it be `agents`?

**Current Code (agent.py:25-36):**
```python
investigation_pipeline = SequentialAgent(
    name="investigation_pipeline",
    sub_agents=[
        source_finder,      # Discovers sources → discovered_sources
        claim_extractor,    # Extracts claims → extracted_claims
        # ... more agents
    ],
    description="Sequential pipeline executing the investigation workflow stages",
)
```

### 🔍 Investigation Findings:

**✅ CONFIRMED CORRECT** - `sub_agents` is the correct parameter name.

**Evidence:**
1. **ADK Documentation confirms** - SequentialAgent uses `sub_agents` parameter to define the sequence of agents to execute.
2. **Reference implementation** found at `ai_docs/refs/adk-agent-simple/apps/competitor-analysis-agent/.../research_pipeline/agent.py`:
   ```python
   research_pipeline = SequentialAgent(
       name="research_pipeline",
       description="...",
       sub_agents=[
           section_planner_agent,
           section_researcher_agent,
           iterative_refinement_loop,
           report_composer_agent,
       ],
   )
   ```

**Resolution:** ✅ No change needed. Current implementation is correct.

---

### Issue #2: Import Shadowing (ORCHESTRATOR_INSTRUCTION)

**Question:** Is there a local definition of `ORCHESTRATOR_INSTRUCTION` overriding the import?

**Current Code (agent.py:8):**
```python
from .prompts import ORCHESTRATOR_INSTRUCTION
```

### 🔍 Investigation Findings:

**✅ NO ISSUE FOUND** - The import is used correctly without shadowing.

**Evidence:**
1. **Checked agent.py** - The file imports `ORCHESTRATOR_INSTRUCTION` from `.prompts` at line 8
2. **No local redefinition** - There is NO second definition of `ORCHESTRATOR_INSTRUCTION` anywhere in `agent.py`
3. **Proper usage** - The imported constant is used correctly at line 45:
   ```python
   investigation_orchestrator = LlmAgent(
       name="investigation_orchestrator",
       model="gemini-2.5-flash",
       instruction=ORCHESTRATOR_INSTRUCTION,  # ✅ Uses the import
       # ...
   )
   ```
4. **prompts.py verified** - Contains the full `ORCHESTRATOR_INSTRUCTION` definition at lines 10-64

**Resolution:** ✅ No change needed. The import pattern is correct and there's no shadowing.

---

### Issue #3: LLM Tool + Sub-Agent Dual Execution Risk

**Question:** Will the LLM reliably call BOTH `callback_api_tool` AND delegate to `investigation_pipeline` in the same turn?

**Current ORCHESTRATOR_INSTRUCTION (prompts.py:47-50):**
```
- If user says "APPROVED", "Start", "Yes", or "Go":
  - Output: "[INVESTIGATION_STARTED]"
  - Call callback_api_tool with type="INVESTIGATION_STARTED" to set status = "in_progress"
  - Delegate to `investigation_pipeline`
```

### 🔍 Investigation Findings:

**⚠️ POTENTIAL RISK IDENTIFIED** - LLM behavior with multiple actions is non-deterministic.

**Analysis:**
1. **Sub-agents as tools:** In ADK, sub-agents are exposed as tools to the parent LlmAgent. The LLM must decide to call them.
2. **Multi-tool execution:** While LLMs CAN call multiple tools in one turn, there's no guarantee they will always do so.
3. **Possible failure modes:**
   - LLM calls `callback_api_tool` ✅ then waits for user response ❌
   - LLM delegates to pipeline ✅ but forgets to call callback ❌
   - LLM executes both correctly ✅
4. **Instruction clarity:** The current instruction says "Call... then Delegate..." which is correct phrasing but relies on LLM execution consistency.

### 🚨 Recommended Fix Options:

**Option A: Wrapper Tool Pattern (Recommended)**
Create a single tool that does both operations atomically:
```python
@tool
def start_investigation(investigation_id: str) -> str:
    """
    Start the investigation by updating status and returning delegation instruction.
    """
    # 1. Call callback API to update status
    update_investigation_status(investigation_id, "in_progress")
    
    # 2. Return instruction for LLM to delegate
    return "Status updated. Now delegating to investigation_pipeline."
```

**Option B: Callback-in-Pipeline Pattern**
Move the "INVESTIGATION_STARTED" callback to a `before_agent_callback` on the `investigation_pipeline`:
```python
def pipeline_started_callback(callback_context: CallbackContext) -> None:
    """Called when investigation_pipeline starts."""
    investigation_id = callback_context.state.get("investigation_id")
    if investigation_id:
        # Make callback API call here
        update_investigation_status(investigation_id, "in_progress")

investigation_pipeline = SequentialAgent(
    name="investigation_pipeline",
    before_agent_callback=pipeline_started_callback,  # Ensures callback happens
    sub_agents=[...],
)
```

**Option C: Sequential Sub-Agent**
Create a tiny sub-agent that ONLY calls the callback, and place it first in the pipeline:
```python
status_updater = LlmAgent(
    name="status_updater",
    instruction="Call callback_api_tool with type='INVESTIGATION_STARTED'",
    tools=[callback_api_tool],
)

investigation_pipeline = SequentialAgent(
    sub_agents=[
        status_updater,      # FIRST: Updates status
        source_finder,       # Then continues with investigation
        # ...
    ],
)
```

**Decision Required:** Which approach do you prefer?

---

### Issue #4: Model ID Validation (`gemini-2.5-flash`)

**Question:** Is `gemini-2.5-flash` a valid, released model ID?

**Current Code (agent.py:44):**
```python
investigation_orchestrator = LlmAgent(
    name="investigation_orchestrator",
    model="gemini-2.5-flash",
    # ...
)
```

### 🔍 Investigation Findings:

**✅ CONFIRMED VALID** - `gemini-2.5-flash` is a valid, released model ID.

**Evidence:**
1. **Stable release:** Gemini 2.5 Flash (`gemini-2.5-flash`) was generally available as of June 17, 2025
2. **Current date:** February 5, 2026 - the model has been available for ~8 months
3. **Model capabilities:** Supports text, code, images, audio, and video inputs; suitable for low-latency, high-volume tasks
4. **Vertex AI / Gemini API compatible:** This is the standard model ID used in Google Cloud / AI Studio environments

**Resolution:** ✅ No change needed. The model ID is valid and current.

---

## 3. Summary

| Issue | Status | Action Required |
|-------|--------|-----------------|
| #1: SequentialAgent `sub_agents` parameter | ✅ Correct | None |
| #2: Import shadowing of ORCHESTRATOR_INSTRUCTION | ✅ No issue | None |
| #3: Dual tool+delegation execution reliability | ⚠️ Risk | **USER DECISION NEEDED** |
| #4: `gemini-2.5-flash` model ID validity | ✅ Valid | None |

---

## 4. Implementation Complete

**For Issue #3**: Implemented **Option B: Callback-in-Pipeline Pattern** ✅

### Changes Made:

1. **[callbacks.py](file:///c:/Users/Daniel Reddy/Desktop/scryb-v/apps/vicaran-agent/vicaran_agent/callbacks.py)** - Added `pipeline_started_callback()`:
   - Fires `INVESTIGATION_STARTED` automatically when pipeline begins
   - Makes direct HTTP call to callback API (deterministic, not LLM-dependent)
   - Includes debug logging consistent with other callbacks

2. **[agent.py](file:///c:/Users/Daniel Reddy/Desktop/scryb-v/apps/vicaran-agent/vicaran_agent/agent.py)** - Connected callback to pipeline:
   - Added `before_agent_callback=pipeline_started_callback` to `investigation_pipeline`
   - Status update now happens 100% of the time when pipeline starts

3. **[prompts.py](file:///c:/Users/Daniel Reddy/Desktop/scryb-v/apps/vicaran-agent/vicaran_agent/prompts.py)** - Simplified orchestrator instruction:
   - Removed "Call callback_api_tool with type=INVESTIGATION_STARTED" instruction
   - Updated to note status is updated automatically

### Why This Approach Wins:

- **Deterministic**: Code guarantees the callback fires - no LLM variability
- **Zero latency**: No extra LLM inference or tool round-trips
- **Clean separation**: Orchestrator decides, Pipeline executes (with status update)
