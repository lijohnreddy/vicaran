# Fix: Topic/Brief Not Passed to Agent Sub-agents

> **Task Complexity:** 🟢 SIMPLE - Single callback function fix  
> **Estimated Time:** ~15 minutes

---

## 1. Task Overview

**Title:** Fix Topic/Brief Not Passed to Agent Sub-agents

**Goal:** When an investigation is created, the agent should receive the topic/brief in `investigation_config` so that Source Finder and other sub-agents can proceed with the investigation.

---

## 4. Context & Problem Definition

### Problem Statement

When an investigation is created and the agent runs:
- Source Finder outputs: **"The investigation cannot proceed as the topic was not provided."**
- All downstream agents cascade fail (no sources → no claims → no fact checks)

**Evidence from session state:**
```json
{
  "investigation_brief": "Where is Indian in AI 2026",  // ✅ Brief IS stored
  "investigation_mode": "quick",                        // ✅ Mode IS stored
  "investigation_config": {}                            // ❌ EMPTY!
}
```

### Root Cause

In `callbacks.py`, the `initialize_investigation_state()` function sets:

```python
session_state["investigation_config"] = {}  # Line 85 - Empty dict!
```

The **Source Finder** prompt expects data from `{investigation_config}`:
```
Investigation Config: {investigation_config}
```

But `{investigation_config}` is `{}` (empty). The brief exists in `investigation_brief` but is never copied to `investigation_config`.

Per the workflow document (`vicaran_investigation_workflow.md` lines 283-300), `investigation_config` should contain:
```json
{
  "investigation_id": "uuid-123",
  "mode": "quick",
  "title": "Indian AI",
  "brief": "Where is Indian in AI 2026",
  "skip_timeline": true,
  "source_limit": 15
}
```

### Success Criteria

- [ ] `investigation_config` contains `title` and `brief`
- [ ] Source Finder proceeds with investigation (no "topic not provided" error)
- [ ] Agent generates proper investigation plan

---

## 11. Implementation Plan

### Phase 1: Fix investigation_config Population

- [ ] **Task 1.1:** Modify `initialize_investigation_state()` in `callbacks.py`
  - Add regex to extract `Title:` from user prompt
  - Add regex to extract `**Investigation Brief:**` from user prompt
  - Fallback to `investigation_brief` from session state if regex fails
  - Populate `investigation_config` with all required fields

**Code Change:**

```python
# callbacks.py - initialize_investigation_state()

# Extract title from prompt (format: "Title: XYZ")
title_match = re.search(r"Title:\s*(.+?)(?:\n|$)", user_prompt)
title = title_match.group(1).strip() if title_match else ""

# Extract brief from prompt (format: "**Investigation Brief:**\nXYZ")
brief_match = re.search(r"\*\*Investigation Brief:\*\*\s*(.+?)(?:\n\n|$)", user_prompt, re.DOTALL)
brief = brief_match.group(1).strip() if brief_match else ""

# Fallback to existing session state (set during ADK session creation)
if not brief:
    brief = session_state.get("investigation_brief", "")
if not title:
    title = brief[:50] if brief else "Untitled Investigation"

investigation_id = session_state.get("investigation_id", "")

session_state["investigation_config"] = {
    "investigation_id": investigation_id,
    "mode": mode,
    "title": title,
    "brief": brief,
    "skip_timeline": mode == "quick",
    "source_limit": 15 if mode == "quick" else 30,
    "bias_level": "overall" if mode == "quick" else "per_source",
}
```

### Phase 2: Verification

- [ ] **Task 2.1:** Manual Browser Testing
  - Create new investigation via `/investigations/new`
  - Observe agent response in chat
  - Verify Source Finder proceeds (no "topic not provided" error)

---

## Task Completion Tracking

- [ ] Code changes complete
- [ ] Code review complete
- [ ] User testing complete
