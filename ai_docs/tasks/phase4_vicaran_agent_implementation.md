# Phase 4: Vicaran Investigation Agent Implementation

> **Task Type**: ADK Agent System Implementation  
> **Deadline**: February 10, 2026 (Hackathon MVP)  
> **Reference**: [`ai_docs/prep/vicaran_investigation_workflow.md`](file:///c:/Users/Daniel%20Reddy/Desktop/scryb-v/ai_docs/prep/vicaran_investigation_workflow.md)

---

## 1. Task Overview

### Agent System Title
**Vicaran Investigation Agent** - AI-powered investigative journalism research assistant

### Goal Statement
Transform the existing `competitor-analysis-agent` template into a fully functional Vicaran investigation agent that helps journalists investigate stories by gathering sources, extracting claims, fact-checking, analyzing bias, building timelines, and generating comprehensive summaries. The agent must integrate with the existing Next.js web app via the callback API for data persistence and SSE streaming.

### State Integrity Principle
> Every task author is **personally responsible** for tracing **all** session-state keys end-to-end across the workflow.  
> • If an agent tries to read a key that no upstream agent writes, **stop immediately**, alert the user, and present proposed remedy.

---

## 2. Prerequisites Completed

### ✅ Already Completed (Prior Phases)
- [x] **Phase 1**: Project Setup - Monorepo with Next.js and ADK template
- [x] **Phase 2**: Database Schema - Supabase tables for investigations, sources, claims, fact_checks, timeline_events
- [x] **Phase 3**: Callback API - All endpoints implemented in `apps/web/app/api/agent-callback/route.ts`
- [x] **Agent Workflow Design** - Complete design in `ai_docs/prep/vicaran_investigation_workflow.md`
- [x] **INVESTIGATION_STARTED callback** - Implemented with `started_at` field
- [x] **INVESTIGATION_PARTIAL callback** - Implemented with `partial_reason` field for graceful degradation
- [x] **Edge case fixes** - URL normalization, guard clauses, blocked content detection

---

## 3. ADK Project Analysis & Current State

### Existing Agent Structure
```
apps/competitor-analysis-agent/
├── .env.local                    # API keys and config
├── pyproject.toml                # Python dependencies (google-adk>=1.14.1)
├── competitor_analysis_agent/
│   ├── __init__.py               # Export: from .agent import root_agent
│   ├── agent.py                  # Root agent definition (needs replacement)
│   ├── config.py                 # Model configurations (can reuse)
│   ├── models.py                 # Pydantic models (needs new models)
│   ├── sub_agents/               # Existing sub-agents (need replacement)
│   ├── tools/                    # Existing tools (need new tools)
│   └── utils/                    # Utility functions (need updates)
```

### Current Technology Stack
- **Python Version**: 3.10+ with uv dependency management
- **ADK Framework**: Google ADK 1.14.1 with LlmAgent, SequentialAgent
- **Model Integration**: Gemini 2.5 Flash/Pro
- **Session Management**: InMemorySessionService
- **Deployment Target**: Google Cloud Agent Engine

### Callback API Status (✅ Already Implemented)
| Callback Type | Status | Endpoint |
|--------------|--------|----------|
| `SOURCE_FOUND` | ✅ Done | Returns `source_id` |
| `CLAIM_EXTRACTED` | ✅ Done | Returns `claim_id` |
| `FACT_CHECKED` | ✅ Done | Returns `fact_check_id` |
| `BIAS_ANALYZED` | ✅ Done | Per-source bias |
| `TIMELINE_EVENT` | ✅ Done | Returns `event_id` |
| `INVESTIGATION_COMPLETE` | ✅ Done | Updates summary |
| `INVESTIGATION_STARTED` | ✅ Done | Sets `started_at` |
| `INVESTIGATION_PARTIAL` | ✅ Done | Graceful degradation |
| `INVESTIGATION_FAILED` | ✅ Done | Error handling |

---

## 4. Implementation Plan

### Task 1: Rename Agent Application
**Goal**: Transform template agent folder into Vicaran investigation agent

> [!IMPORTANT]
> This is a manual rename operation that affects multiple files.

#### Changes Required:

##### [NEW] Folder Rename
- Rename `apps/competitor-analysis-agent/` → `apps/vicaran-agent/`
- Rename `apps/competitor-analysis-agent/competitor_analysis_agent/` → `apps/vicaran-agent/vicaran_agent/`

##### [MODIFY] [package.json](file:///c:/Users/Daniel%20Reddy/Desktop/scryb-v/package.json)
Update all references from `competitor-analysis-agent` to `vicaran-agent`:
```diff
- "install:backend": "cd apps/competitor-analysis-agent ...",
+ "install:backend": "cd apps/vicaran-agent ...",
- "dev:backend": "cd apps/competitor-analysis-agent ...",
+ "dev:backend": "cd apps/vicaran-agent ...",
# (All 10+ script references)
```

##### [MODIFY] [pyproject.toml](file:///c:/Users/Daniel%20Reddy/Desktop/scryb-v/apps/competitor-analysis-agent/pyproject.toml)
```diff
- name = "competitor-analysis-agent"
+ name = "vicaran-agent"
- description = "ADK agent system for comprehensive competitor analysis"
+ description = "ADK investigation agent for Vicaran journalism platform"
- src = ["competitor_analysis_agent"]
+ src = ["vicaran_agent"]
```

##### [RUN] Install Additional Dependencies
```bash
cd apps/vicaran-agent
uv add httpx
```

> [!NOTE]
> **Why httpx?** The callback_api tool uses `httpx` for its cleaner async HTTP support. Most other dependencies (`requests`, `beautifulsoup4`, `aiohttp`) are already in pyproject.toml.

---

### Task 2: Agent Implementation

#### Agent Hierarchy (from workflow design)
```
investigation_orchestrator (LlmAgent - Root)
├── Tools: [analyze_source_tool, callback_api_tool]
├── Callbacks: [before_agent_callback=initialize_investigation_state]
└── Sub-agents: [investigation_pipeline]
    └── investigation_pipeline (SequentialAgent)
        ├── source_finder (LlmAgent with tavily_search_tool)
        │   └── Callback: after_agent_callback=batch_save_sources
        ├── claim_extractor (LlmAgent with jina_reader_tool)
        │   └── Callback: after_agent_callback=batch_save_claims
        ├── fact_checker (LlmAgent with tavily_search_tool)
        │   └── Callback: after_agent_callback=batch_save_fact_checks
        ├── bias_analyzer (LlmAgent)
        │   └── Callback: after_agent_callback=batch_save_bias_scores
        ├── timeline_builder (LlmAgent) [CONDITIONAL - skipped in Quick mode]
        │   └── Callback: after_agent_callback=batch_save_timeline_events
        └── summary_writer (LlmAgent)
            └── Callback: after_agent_callback=save_final_summary
```

#### Files to Create/Modify

##### [MODIFY] `vicaran_agent/__init__.py`
```python
from .agent import root_agent

__all__ = ["root_agent"]
```

##### [NEW] `vicaran_agent/agent.py`
Root orchestrator with:
- `before_agent_callback=initialize_investigation_state`
- `sub_agents=[investigation_pipeline]`
- `tools=[analyze_source_tool, callback_api_tool]`
- `output_key="investigation_plan"`
- Model: `gemini-2.5-flash`

##### [NEW] `vicaran_agent/callbacks.py`
Implement all callbacks from workflow:
- `initialize_investigation_state`
- `batch_save_sources` (with `source_id_map` storage)
- `batch_save_claims` (with `claim_id_map` storage)
- `batch_save_fact_checks`
- `batch_save_bias_scores`
- `batch_save_timeline_events`
- `save_final_summary`
- `normalize_url` helper

##### [NEW] `vicaran_agent/tools/tavily_search.py`
Tavily Search API integration with rate limiting

##### [NEW] `vicaran_agent/tools/jina_reader.py`
Jina Reader for URL content extraction with blocked content detection

##### [NEW] `vicaran_agent/tools/callback_api.py`
HTTP tool to call Next.js callback API with `X-Agent-Secret` authentication

##### [NEW] `vicaran_agent/tools/analyze_source.py`
User-provided URL analysis with credibility scoring

##### [NEW] `vicaran_agent/sub_agents/source_finder/agent.py`
```python
source_finder = LlmAgent(
    name="source_finder",
    model="gemini-2.5-flash",
    tools=[tavily_search_tool],
    after_agent_callback=batch_save_sources,
    output_key="discovered_sources",
    instruction=SOURCE_FINDER_INSTRUCTION
)
```

##### [NEW] `vicaran_agent/sub_agents/claim_extractor/agent.py`
```python
claim_extractor = LlmAgent(
    name="claim_extractor",
    model="gemini-2.5-flash",
    tools=[jina_reader_tool],
    after_agent_callback=batch_save_claims,
    output_key="extracted_claims",
    instruction=CLAIM_EXTRACTOR_INSTRUCTION
)
```

##### [NEW] `vicaran_agent/sub_agents/fact_checker/agent.py`
```python
fact_checker = LlmAgent(
    name="fact_checker",
    model="gemini-2.5-pro",  # Critical reasoning task
    tools=[tavily_search_tool],
    after_agent_callback=batch_save_fact_checks,
    output_key="fact_check_results",
    instruction=FACT_CHECKER_INSTRUCTION
)
```

##### [NEW] `vicaran_agent/sub_agents/bias_analyzer/agent.py`
```python
bias_analyzer = LlmAgent(
    name="bias_analyzer",
    model="gemini-2.5-flash",
    after_agent_callback=batch_save_bias_scores,
    output_key="bias_analysis",
    instruction=BIAS_ANALYZER_INSTRUCTION
)
```

##### [NEW] `vicaran_agent/sub_agents/timeline_builder/agent.py`
```python
timeline_builder = LlmAgent(
    name="timeline_builder",
    model="gemini-2.5-flash",
    after_agent_callback=batch_save_timeline_events,
    output_key="timeline_events",
    instruction=TIMELINE_BUILDER_INSTRUCTION  # Includes skip check
)
```

##### [NEW] `vicaran_agent/sub_agents/summary_writer/agent.py`
```python
summary_writer = LlmAgent(
    name="summary_writer",
    model="gemini-2.5-pro",  # High-quality writing
    after_agent_callback=save_final_summary,
    output_key="investigation_summary",
    instruction=SUMMARY_WRITER_INSTRUCTION
)
```

##### [NEW] `vicaran_agent/prompts/` directory
Separate instruction files for each agent:
- `orchestrator.py` - Plan generation with `[PLAN_APPROVAL_REQUIRED]` marker
- `source_finder.py` - Per-source streaming output pattern
- `claim_extractor.py` - Guard clause for empty input
- `fact_checker.py` - Verification logic with verdicts
- `bias_analyzer.py` - Mode-aware (overall vs per-source)
- `timeline_builder.py` - Conditional skip logic
- `summary_writer.py` - Citation-rich summary with `[INVESTIGATION_COMPLETE]`

---

### Task 3: Agent Configuration

##### [MODIFY] `.env.local`
```bash
# Google Cloud
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1

# Callback API
CALLBACK_API_URL=http://localhost:3000/api/agent-callback
AGENT_SECRET=shared-secret-with-web-app

# External APIs
TAVILY_API_KEY=your-tavily-key

# Debug
DEBUG_MODE=true
```

##### [MODIFY] `apps/web/.env.local`
```bash
# Agent Secret (must match vicaran-agent)
AGENT_SECRET=shared-secret-with-web-app
ADK_API_URL=http://localhost:8000
```

---

### Task 4: Agent System Validation

##### Validation Steps
1. Run `adk run .` in `apps/vicaran-agent/` to test agent locally
2. Verify agent starts without import errors
3. Test plan generation with sample prompt
4. Verify callback API communication
5. Check data appears in Supabase tables
6. Test Quick Search mode (skip timeline)
7. Test Detailed Inquiry mode (full pipeline)

---

## 5. Session State Data Flow

### Session State Dependency Table

| Agent | Writes (`output_key`) | Reads (`{placeholder}`) |
|-------|----------------------|------------------------|
| `orchestrator` | `investigation_config`, `user_sources`, `investigation_plan` | `user_prompt` |
| `source_finder` | `discovered_sources` | `{investigation_config}`, `{user_sources}` |
| `claim_extractor` | `extracted_claims` | `{discovered_sources}`, `{investigation_config}` |
| `fact_checker` | `fact_check_results` | `{extracted_claims}`, `{discovered_sources}` |
| `bias_analyzer` | `bias_analysis` | `{discovered_sources}`, `{investigation_config}` |
| `timeline_builder` | `timeline_events` | `{extracted_claims}`, `{discovered_sources}` |
| `summary_writer` | `investigation_summary` | ALL previous keys |

### Callback-Written State Keys
| Callback | Writes |
|----------|--------|
| `initialize_investigation_state` | `investigation_id`, `investigation_mode` |
| `batch_save_sources` | `source_id_map` |
| `batch_save_claims` | `claim_id_map` |

---

## 6. Verification Plan

### Automated Tests

> [!WARNING]
> No existing automated tests found for the agent system. Manual verification required for MVP.

### Manual Verification Steps

#### Step 1: Agent Startup Test
```bash
cd apps/vicaran-agent
npx dotenv-cli -e .env.local -- uv run adk run .
```
**Expected**: Agent starts without import errors, displays welcome message.

#### Step 2: Plan Generation Test
In ADK CLI, enter:
```
Investigation ID: test-123
Mode: quick
Investigate claims about company XYZ pollution violations.
Sources: https://reuters.com/example
```
**Expected**: Agent outputs investigation plan with `[PLAN_APPROVAL_REQUIRED]` marker.

#### Step 3: Callback API Test
After approving plan (type "APPROVED"):
**Expected**: 
- `[INVESTIGATION_STARTED]` marker appears
- Sources are saved to database (check Supabase)
- Progress messages stream in chat

#### Step 4: End-to-End Integration Test
Run full investigation and verify:
- [ ] Sources appear in `sources` table
- [ ] Claims appear in `claims` table linked to sources
- [ ] Fact checks appear with verdicts
- [ ] Bias analysis saved
- [ ] Timeline events saved (Detailed mode only)
- [ ] Summary updates investigation record
- [ ] `[INVESTIGATION_COMPLETE]` marker appears

#### Step 5: Web App Integration
```bash
npm run dev  # Start full stack
```
- Create investigation from web UI
- Verify SSE streaming shows progress
- Verify dashboard updates with new data

---

## 7. Implementation Checklist

### Phase 4A: Rename Agent Application
- [ ] Rename `apps/competitor-analysis-agent/` → `apps/vicaran-agent/`
- [ ] Rename inner folder to `vicaran_agent/`
- [ ] Update `package.json` scripts (10+ references)
- [ ] Update `pyproject.toml` metadata
- [ ] Run `uv add httpx` to install async HTTP client

### Phase 4B: Agent Implementation
- [ ] Create `vicaran_agent/__init__.py` with root_agent export
- [ ] Create `vicaran_agent/agent.py` - investigation_orchestrator
- [ ] Create `vicaran_agent/callbacks.py` - all callback implementations
- [ ] Create `vicaran_agent/tools/callback_api.py`
- [ ] Create `vicaran_agent/tools/tavily_search.py`
- [ ] Create `vicaran_agent/tools/jina_reader.py`
- [ ] Create `vicaran_agent/tools/analyze_source.py`
- [ ] Create `sub_agents/source_finder/agent.py`
- [ ] Create `sub_agents/claim_extractor/agent.py`
- [ ] Create `sub_agents/fact_checker/agent.py`
- [ ] Create `sub_agents/bias_analyzer/agent.py`
- [ ] Create `sub_agents/timeline_builder/agent.py`
- [ ] Create `sub_agents/summary_writer/agent.py`
- [ ] Create all prompt files in `prompts/` directory

### Phase 4C: Agent Configuration
- [ ] Update `vicaran_agent/.env.local`
- [ ] Update `apps/web/.env.local` with `AGENT_SECRET`

### Phase 4D: Validation
- [ ] Run `adk run .` successfully
- [ ] Test plan generation
- [ ] Test callback API communication
- [ ] Verify database persistence
- [ ] Test Quick Search mode
- [ ] Test Detailed Inquiry mode

---

## 8. Key Implementation Notes

### Critical Patterns from Workflow Document

1. **Plan Approval Flow**: Orchestrator outputs `[PLAN_APPROVAL_REQUIRED]`, waits for user "APPROVED" message before delegating to pipeline.

2. **Per-Source Streaming**: Source finder processes sources ONE AT A TIME with streaming output to chat.

3. **ID Propagation**: Callbacks store `source_id_map` and `claim_id_map` for downstream agents to link entities correctly.

4. **URL Normalization**: Use `normalize_url()` helper when matching claim URLs to source URLs.

5. **Guard Clauses**: All agents check for empty input before processing to prevent LLM hallucination.

6. **Timeline Skip**: Timeline builder checks `skip_timeline` flag and returns `[TIMELINE_SKIPPED]` if true.

7. **Blocked Content Detection**: Use `is_blocked_content()` to identify failed URL fetches.

---

*Document Version: 1.0*  
*Created: February 5, 2026*  
*Reference Workflow: [`vicaran_investigation_workflow.md`](file:///c:/Users/Daniel%20Reddy/Desktop/scryb-v/ai_docs/prep/vicaran_investigation_workflow.md)*
