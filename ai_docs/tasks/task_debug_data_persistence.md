# Task: Debug Data Persistence Issue

> **Priority:** 🔴 Critical - Blocking core functionality
> **Created:** 2026-02-08

---

## 1. Task Overview

### Task Title
**Title:** Agent data not persisting to database despite successful investigation completion

### Goal Statement
**Goal:** Identify and fix why investigation data (sources, claims, fact-checks, bias, timeline) is not being saved to the database when the agent completes an investigation. The user sees a complete investigation summary but the canvas tabs show empty data.

---

## 2. Problem Evidence

### User-Reported Issue
The investigation for "Zerodha company" completed successfully with:
- ✅ 5 sources discovered
- ✅ 5 key findings extracted
- ✅ Bias assessment (2.2/10)
- ✅ 3 timeline events
- ✅ Full summary with `[INVESTIGATION_COMPLETE]` marker

**But database shows:**
```json
{
  "id": "d762af6d-d02e-4a7e-a629-d26d3a897d23",
  "status": "pending",        // ❌ Should be "completed"
  "started_at": null,          // ❌ Should be set
  "summary": null,             // ❌ Should have summary
  "overall_bias_score": null   // ❌ Should be "2.20"
}
```

**Database query results:**
```
SOURCES: []   // ❌ Should have 5 sources
CLAIMS: []    // ❌ Should have claims
```

---

## 3. Identified Potential Issues

### Issue 1: `INVESTIGATION_STARTED` Callback Not Firing
**Evidence:** `status = 'pending'` and `started_at = null`

**Expected Flow:**
```
pipeline_started_callback → INVESTIGATION_STARTED → status='active', started_at=NOW()
```

**Possible Causes:**
- [ ] `before_agent_callback=pipeline_started_callback` not being invoked by ADK
- [ ] `investigation_id` not found in session state (check) → callback skips
- [ ] HTTP request to `/api/agent-callback` failing silently
- [ ] `AGENT_SECRET` mismatch between ADK and Next.js

**Files to check:**
- `apps/vicaran-agent/vicaran_agent/callbacks.py` (lines 142-184)
- `apps/vicaran-agent/vicaran_agent/config.py` (agent_secret config)
- `apps/web/app/api/agent-callback/route.ts` (lines 362-414)

---

### Issue 2: Agent LLM Not Calling `callback_api_tool`
**Evidence:** No sources/claims in database despite agent output showing them

**Expected Flow:**
```
source_finder agent → calls callback_api_tool("SOURCE_FOUND", {...}) → /api/agent-callback → INSERT into sources
```

**Possible Causes:**
- [ ] LLM is generating text output but NOT making tool calls
- [ ] Prompt instructions not clear enough to trigger tool invocation
- [ ] Tool not registered correctly with sub-agents
- [ ] `DEBUG_MODE=false` hiding error logs

**Current architecture (from agent.py):**
```python
# Sub-agents have callback_api_tool registered:
source_finder     → tools=[tavily_search_tool, jina_reader_tool, callback_api_tool]
claim_extractor   → tools=[jina_reader_tool, callback_api_tool]
fact_checker      → tools=[tavily_search_tool, callback_api_tool]
bias_analyzer     → tools=[callback_api_tool]
timeline_builder  → tools=[callback_api_tool]
```

**Files to check:**
- `apps/vicaran-agent/vicaran_agent/prompts.py` (tool call instructions)
- `apps/vicaran-agent/vicaran_agent/sub_agents/*.py` (tool registration)

---

### Issue 3: Configuration/Environment Issues
**Possible Causes:**
- [ ] `AGENT_SECRET` not matching between ADK and Next.js
- [ ] `CALLBACK_API_URL` pointing to wrong URL
- [ ] `DEBUG_MODE=false` hiding all debug logs
- [ ] Network connectivity issues between ADK server and Next.js server

**Files to check:**
- `.env.local` in project root
- `apps/web/.env.local`

**Required env vars:**
```bash
# For ADK
DEBUG_MODE=true
AGENT_SECRET=your-secret
CALLBACK_API_URL=http://localhost:3000/api/agent-callback

# For Next.js
AGENT_SECRET=your-secret  # Must match!
```

---

### Issue 4: Investigation ID Mismatch
**Possible Causes:**
- [ ] ADK session has different ID than frontend investigation
- [ ] `investigation_id` not being passed correctly in prompt
- [ ] Regex extraction failing in `initialize_investigation_state`

**Expected prompt format:**
```
Investigation ID: d762af6d-d02e-4a7e-a629-d26d3a897d23
Title: Zerodha
**Investigation Brief:** Investigate Zerodha company
```

**Files to check:**
- `apps/vicaran-agent/vicaran_agent/callbacks.py` (lines 60-135)
- Frontend code that sends investigation to ADK

---

### Issue 5: Summary Not Being Saved
**Evidence:** `summary = null` even though `[INVESTIGATION_COMPLETE]` marker was present

**Expected Flow:**
```
summary_writer output contains [INVESTIGATION_COMPLETE]
  → save_final_summary callback fires
  → HTTP POST to /api/agent-callback with type=INVESTIGATION_COMPLETE
  → UPDATE investigations SET summary=..., status='completed'
```

**Possible Causes:**
- [ ] `save_final_summary` callback not registered on `summary_writer`
- [ ] Callback not detecting `[INVESTIGATION_COMPLETE]` marker
- [ ] HTTP request failing

**Files to check:**
- `apps/vicaran-agent/vicaran_agent/callbacks.py` (lines 235-282)
- `apps/vicaran-agent/vicaran_agent/sub_agents/summary_writer.py`

---

## 4. Debugging Steps

### Step 1: Enable Debug Mode
```bash
# In .env.local (project root)
DEBUG_MODE=true
```

This will print:
- 🚀 CALLBACK FIRED logs
- 🆔 Investigation ID
- 📦 PAYLOAD data
- ✅ or ❌ Response status

### Step 2: Verify Environment Variables
Check both ADK and Next.js have matching secrets:
```bash
# ADK .env.local
AGENT_SECRET=your-secret-here

# Web .env.local  
AGENT_SECRET=your-secret-here  # Must match!
```

### Step 3: Run Investigation with Debug Enabled
1. Start ADK: `npm run adk:api`
2. Start Web: `npm run dev`
3. Create new investigation
4. Watch ADK terminal for callback logs

### Step 4: Test Callback Endpoint Manually
```bash
curl -X POST http://localhost:3000/api/agent-callback \
  -H "Content-Type: application/json" \
  -H "X-Agent-Secret: your-secret-here" \
  -d '{
    "type": "SOURCE_FOUND",
    "investigation_id": "d762af6d-d02e-4a7e-a629-d26d3a897d23",
    "data": {
      "url": "https://example.com/test",
      "title": "Test Source",
      "credibility_score": 4
    }
  }'
```

Expected response:
```json
{"success": true, "source_id": "uuid-here"}
```

### Step 5: Check Sub-Agent Registration
Verify `after_agent_callback` is set for summary_writer:
```python
# In summary_writer.py - should have:
after_agent_callback=save_final_summary
```

---

## 5. Implementation Fixes (After Debugging)

Based on findings, potential fixes:

### Fix A: Ensure Callbacks are Registered
```python
# summary_writer.py
summary_writer = LlmAgent(
    ...
    after_agent_callback=save_final_summary,  # Add if missing
)
```

### Fix B: Make Prompts More Explicit About Tool Calls
```python
# In prompts.py - add MANDATORY language:
"""
⚠️ MANDATORY: You MUST call callback_api_tool for EACH source.
Do NOT just describe the sources in text.
You MUST actually invoke the tool with:
  callback_api_tool(
      callback_type="SOURCE_FOUND",
      data={"url": "...", "title": "...", ...}
  )
"""
```

### Fix C: Add Deterministic Callbacks (Like pipeline_started)
Instead of relying on LLM to call tools, use `after_agent_callback` to parse output and save deterministically.

---

## 6. Success Criteria

- [ ] Running investigation shows callback logs in ADK terminal
- [ ] Database shows `status='active'` after investigation starts  
- [ ] Database shows sources/claims/timeline after investigation completes
- [ ] Database shows `status='completed'` and `summary` populated
- [ ] Canvas tabs display the saved data

---

## 7. Related Files

### Backend (ADK Agent)
- `apps/vicaran-agent/vicaran_agent/agent.py`
- `apps/vicaran-agent/vicaran_agent/callbacks.py`
- `apps/vicaran-agent/vicaran_agent/config.py`
- `apps/vicaran-agent/vicaran_agent/prompts.py`
- `apps/vicaran-agent/vicaran_agent/tools/callback_api.py`
- `apps/vicaran-agent/vicaran_agent/sub_agents/*.py`

### Frontend (Next.js)
- `apps/web/app/api/agent-callback/route.ts`
- `apps/web/app/actions/canvas.ts`
- `apps/web/lib/drizzle/schema/*.ts`

### Configuration
- `.env.local` (project root)
- `apps/web/.env.local`
