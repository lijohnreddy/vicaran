# Task: Callback System Debug & Analysis

> **Instructions:** Analysis of the 404 Callback Issue and Comparison with Reference Project.

---

## 1. Task Overview

### Task Title
**Title:** Debugging 404 Callback Issue & Architecture Comparison

### Goal Statement
**Goal:** Resolve the 404 error in Agent-to-Web callbacks by analyzing the discrepancy between our monolithic `vicaran-agent` implementation and the reference `youtube-workflow-agent` implementation.

---

## 2. Strategic Analysis: Reference vs. Current Architecture

### 🔍 Architectural Divergence
The core finding is a fundamental difference in how the two systems handle agent callbacks:

| Feature | Reference (`youtube-workflow-agent`) | Current (`vicaran-agent`) |
| :--- | :--- | :--- |
| **Routing Strategy** | **Targeted/RESTful** | **Monolithic/RPC-style** |
| **API Endpoints** | `/api/agent/outputs`<br>`/api/agent/prompts` | `/api/agent-callback` |
| **Payload Structure** | Specific schema per endpoint (e.g., `step_name`, `output_content`) | Generic envelope with `type` field (e.g., `SOURCE_FOUND`) |
| **Logic Location** | `api_tools.py` directly hits specific URLs | `callback_api.py` hits single URL, logic switched in `route.ts` |
| **State Handling** | Saves "Artifacts" (titles, hooks) | Saves "Events" (sources, claims, bias) |

### 🛠 The 404 Issue Root Cause Candidates
Since the architecture is different, the 404 is likely due to **configuration mismatch**, not just missing code.

1.  **URL Mismatch**: Agent configured for `/api/agent` (Ref style) but app serves `/api/agent-callback`.
2.  **Network Isolation**: Agent running in Docker/Container cannot see `localhost:3000`.
3.  **Missing Route**: The route file `apps/web/app/api/agent-callback/route.ts` exists, so the route *should* yield 200 or 405/500, not 404, unless the path is typed wrong in config.

---

## 3. Detailed "Line-by-Line" Comparison

### 📂 Reference Project (`youtube-workflow-agent`)
**File:** `tools/api_tools.py`
- **Function `save_workflow_output`**:
  - Constructs URL: `f"{config.web_app_url}/api/agent/outputs"`
  - Payload: `{ session_id, step_name, output_content, user_id }`
  - Purpose: Generic storage for any step's text output.

**File:** `apps/web/app/api/agent/outputs/route.ts`
- **Function `POST`**:
  - Validates `step_name` against allowlist (`title_output`, `hook_output`, etc.).
  - Upserts to `session_outputs` table.
  - **Key Insight:** This is a simple Key-Value store implementation for string outputs.

### 📂 Current Project (`vicaran-agent`)
**File:** `tools/callback_api.py`
- **Function `callback_api_tool`**:
  - Constructs URL: `config.callback_api_url` (Default: `http://localhost:3000/api/agent-callback`)
  - Payload: `{ type: "SOURCE_FOUND", investigation_id: "...", data: { ... } }`
  - Purpose: Event-driven data ingestion for complex schema.

**File:** `apps/web/app/api/agent-callback/route.ts`
- **Function `POST`**:
  - Switch statement on `body.type`.
  - Handles `SOURCE_FOUND`, `CLAIM_EXTRACTED`, etc.
  - Writes to specific normalized tables (`sources`, `claims`).
  - **Key Insight:** This is a complex Domain-Specific ingestion pipeline.

---

## 4. Implementation Details & Fixes

### ✅ 1. Configuration Verification
**File:** `apps/vicaran-agent/vicaran_agent/config.py`
```python
# CURRENT
callback_api_url: str = Field(
    default="http://localhost:3000/api/agent-callback",
    description="URL for callback API",
)
```
**Check:** Ensure `.env` or `.env.local` in the Agent directory matches the actual running URL of the web app.

### ✅ 2. Network Check (If Dockerized)
If the agent is running in a Docker container, `localhost` refers to the **container**, not the host machine.
**Fix:**
- Use `http://host.docker.internal:3000/api/agent-callback`
- OR use the actual local IP address (e.g., `http://192.168.1.100:3000/...`).

### ✅ 3. URL Trailing Slash
Next.js redirects trailing slashes by default.
- If config is `.../api/agent-callback/`, it might redirect to `.../api/agent-callback`.
- If the HTTP client doesn't follow redirects automatically, this could fail (though usually 307/308, not 404).

---

## 5. Recommendation

**🎯 Immediate Fix:**
1.  Verify the running URL of the Web App (Port 3000?).
2.  Update `CALLBACK_API_URL` in `apps/vicaran-agent/.env` to ensure it matches the accessible host.
3.  If running via `npm run adk:api` (Host vs Container): Ensure the agent can reach the web app port.

**🔮 Long-term Strategy:**
The current monolithic approach (`agent-callback`) is valid for the `vicaran` domain complexity. Switching to the Reference style (`outputs`) would require rewriting the entire data model to be Key-Value based, which is **not recommended** given the specific schema requirements (Claims, Sources, FactChecks).

**Verdict:** Stick with `agent-callback` but fix the connectivity/URL configuration.
