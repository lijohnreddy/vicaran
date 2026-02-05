# Vicaran Development Roadmap

> **AI-Powered Investigation Assistant for Journalists**
> 
> **Hackathon Deadline:** February 10, 2026
> **Template Base:** ADK-Agent-SaaS

---

## 🚨 Phase 0: Project Setup (MANDATORY FIRST STEP)

**Goal**: Prepare development environment and understand current codebase

**⚠️ CRITICAL**: This phase must be completed before any other development work begins

### Run Setup Analysis
[Goal: Essential first step to configure environment, database, and authentication]

- [ ] **REQUIRED**: Run `SETUP.md` using **gemini-2.5-pro** on **max mode** for maximum context
- [ ] Review generated setup analysis and recommendations
- [ ] Verify development environment is properly configured (Node.js 18+, Python 3.10+, UV, gcloud CLI)
- [ ] Confirm both `apps/web/.env.local` and `apps/vicaran-agent/.env.local` are created
- [ ] Complete Supabase project setup (auth, database URL, API keys)
- [ ] Complete Google Cloud Platform setup (Vertex AI, Gemini API)
- [ ] Verify `npm run dev` starts the web application successfully
- [ ] Verify Python agent dependencies are installed via UV

---

## Phase 1: Landing Page & Branding

**Goal**: Update landing page to reflect Vicaran branding and value proposition

### Update Application Branding
[Goal: Create compelling first impression for hackathon judges]

- [ ] Analyze `ai_docs/prep/app_name.md` for branding requirements (Vicaran)
- [ ] Review `ai_docs/prep/wireframe.md` for landing page layout structure
- [ ] Review `ai_docs/prep/ui_theme.md` for color scheme and styling

### Landing Page Implementation
[Goal: Convert visitors with clear value proposition]

- [ ] Update `app/(public)/page.tsx` with Vicaran branding
  - [ ] Add hero section: "AI-Powered Investigation Assistant for Journalists"
  - [ ] Add tagline about 2x faster investigations
  - [ ] Add feature highlights (source credibility, fact-checking, bias analysis)
  - [ ] Add "Get Started - Free" CTA button
- [ ] Update logo and favicon in `public/` directory
- [ ] Update `app/layout.tsx` metadata (title, description)
- [ ] **Use Task Template**: Run `ai_docs/dev_templates/generate_landing_page.md` for implementation guidance

### Legal Pages
[Goal: Complete public pages for production readiness]

- [ ] Update `app/(public)/privacy/page.tsx` with Vicaran privacy policy
- [ ] Update `app/(public)/terms/page.tsx` with Vicaran terms of service

---

## Phase 2: Authentication Updates

**Goal**: Configure Google OAuth for journalist/researcher users

### Configure Authentication
[Goal: Enable secure user sign-in via Google OAuth]

- [ ] Verify Google OAuth is configured in Supabase dashboard (from Phase 0)
- [ ] Update `app/(auth)/login/page.tsx` with Vicaran branding
  - [ ] Add Vicaran logo
  - [ ] Update welcome message: "Welcome to Vicaran"
  - [ ] Style Google sign-in button
- [ ] Verify authentication flow redirects to `/home` on success
- [ ] Test sign-out flow returns to landing page

**Note**: User creation in database is automatically handled by existing trigger from SETUP.md Phase 3

---

## Phase 3: Database Schema & Callback API

**Goal**: Create all database tables agents need to save investigation results

**⚠️ TIMING**: This phase must be completed BEFORE agent orchestration

### Database Schema Implementation
[Goal: Create data foundation for investigation features]

**🚨 CRITICAL**: Run all Drizzle commands from `apps/web/` directory

- [ ] Create `drizzle/schema/investigations.ts`
  - [ ] Fields: id, user_id, session_id, title, brief, mode (quick/detailed), status, summary, overall_bias_score, created_at, updated_at
  - [ ] Add foreign key to users table
  - [ ] Add investigation_mode and investigation_status enums

- [ ] Create `drizzle/schema/sources.ts`
  - [ ] Fields: id, investigation_id, url, title, content_snippet, credibility_score, bias_score, is_user_provided, analyzed_at, created_at
  - [ ] Add foreign key to investigations table
  - [ ] Add unique constraint on (investigation_id, url)

- [ ] Create `drizzle/schema/claims.ts`
  - [ ] Fields: id, investigation_id, claim_text, status (verified/unverified/contradicted), evidence_count, created_at, updated_at
  - [ ] Add claim_status enum
  - [ ] Add foreign key to investigations table

- [ ] Create `drizzle/schema/claim-sources.ts`
  - [ ] Junction table: claim_id, source_id
  - [ ] Primary key on (claim_id, source_id)

- [ ] Create `drizzle/schema/fact-checks.ts`
  - [ ] Fields: id, claim_id, source_id, evidence_type (supporting/contradicting), evidence_text, created_at
  - [ ] Add evidence_type enum
  - [ ] Add foreign keys to claims and sources tables

- [ ] Create `drizzle/schema/timeline-events.ts`
  - [ ] Fields: id, investigation_id, event_date, event_text, source_id, created_at
  - [ ] Add foreign keys to investigations and sources tables

- [ ] Update `drizzle/schema/index.ts` to export all new schemas
- [ ] Run `npm run db:generate` to create migration
- [ ] Run `npm run db:migrate` to apply migration
- [ ] Generate down migration following `ai_docs/templates/drizzle_down_migration.md`

### Callback API Implementation
[Goal: Create endpoint for agents to save investigation data]

- [ ] Create `app/api/agent-callback/route.ts`
  - [ ] Add shared secret authentication via `X-Agent-Secret` header
  - [ ] Handle callback types: SOURCE_FOUND, CLAIM_EXTRACTED, FACT_CHECKED, BIAS_ANALYZED, TIMELINE_EVENT, SUMMARY_UPDATED, INVESTIGATION_COMPLETE, INVESTIGATION_FAILED
  - [ ] **NEW**: Handle `INVESTIGATION_STARTED` callback to set status = "in_progress"
  - [ ] **NEW**: Handle `INVESTIGATION_PARTIAL` callback for graceful degradation
  - [ ] Return created IDs (source_id, claim_id) for session state propagation
  - [ ] Implement type-safe request validation
  - [ ] Save data to appropriate tables based on callback type

- [ ] Create `lib/queries/investigations.ts`
  - [ ] Add `createInvestigation()` function
  - [ ] Add `getInvestigation()` function
  - [ ] Add `updateInvestigation()` function
  - [ ] Add `getUserInvestigations()` function

- [ ] Create `lib/queries/sources.ts`
  - [ ] Add `createSource()` function
  - [ ] Add `getSourcesByInvestigation()` function

- [ ] Create `lib/queries/claims.ts`
  - [ ] Add `createClaim()` function
  - [ ] Add `getClaimsByInvestigation()` function
  - [ ] Add `updateClaimStatus()` function

- [ ] Create server actions in `app/actions/investigations.ts`
  - [ ] Add `createInvestigationAction()` for form submission
  - [ ] Add `deleteInvestigationAction()` for history management

---

## Phase 4: Agent Orchestration

**Goal**: Design and implement the investigation agent workflow that powers Vicaran

**⚠️ TIMING**: This phase must come AFTER database/callback API but BEFORE features that display agent results

### Rename Agent Application
[Goal: Transform template agent into Vicaran investigation agent]

- [ ] Rename `apps/competitor-analysis-agent/` to `apps/vicaran-agent/`
- [ ] Update `package.json` scripts to reference new folder name
- [ ] Update any imports/references to the old folder name

### Agent Workflow Design (MANDATORY STEP)
[Goal: Design agent system architecture based on investigation requirements]

- [ ] **REQUIRED**: Reference `ai_docs/prep/competition_workflow.md` for existing agent design
- [ ] **REQUIRED**: Run `ai_docs/dev_templates/agent_orchestrator.md` for refinement
- [ ] Design agent hierarchy for investigation workflow:
  ```
  investigation_orchestrator (LlmAgent - Root)
  └── investigation_pipeline (SequentialAgent)
      ├── source_finder (LlmAgent with Tavily/Jina)
      ├── claim_extractor (LlmAgent)
      ├── fact_checker (LlmAgent)
      ├── bias_analyzer (LlmAgent) - Simplified for MVP
      ├── timeline_builder (LlmAgent) - Simplified for MVP
      └── summary_writer (LlmAgent)
  ```
- [ ] Save agent workflow design to `ai_docs/prep/vicaran_investigation_workflow.md`

### Agent Implementation
[Goal: Build Python ADK agent system that integrates with web app]

- [ ] Create `apps/vicaran-agent/vicaran_agent/__init__.py`
  - [ ] Export root_agent for ADK discovery

- [ ] Create `apps/vicaran-agent/vicaran_agent/agent.py`
  - [ ] Implement `investigation_orchestrator` as root LlmAgent
  - [ ] Configure model as `gemini-2.5-flash`
  - [ ] Set up `before_agent_callback` for state initialization
  - [ ] Configure sub_agents with investigation_pipeline
  - [ ] **Call `INVESTIGATION_STARTED` callback when pipeline begins**
  - [ ] Implement plan approval flow with `[PLAN_APPROVAL_REQUIRED]` marker

- [ ] Create `apps/vicaran-agent/vicaran_agent/sub_agents/source_finder.py`
  - [ ] Implement Tavily Search API for source discovery
  - [ ] Implement Jina Reader for content extraction
  - [ ] **Per-source processing (NOT batch)**:
    - [ ] For each source: fetch → summarize (500 chars) → stream → save
    - [ ] Stream format: `📄 Analyzing source X/15: {title}...`
    - [ ] Include credibility rating and key finding in stream
  - [ ] Add credibility scoring (1-5 based on domain lookup)
  - [ ] POST each source via callback API
  - [ ] **Store returned `source_id` in session state `source_id_map`**
  - [ ] Output final summary with credibility breakdown

- [ ] Create `apps/vicaran-agent/vicaran_agent/sub_agents/claim_extractor.py`
  - [ ] **Read source summaries from session state (NOT raw content)**
  - [ ] Extract and rank claims from summarized sources
  - [ ] POST each claim via callback API
  - [ ] **Store returned `claim_id` in session state `claim_id_map`**
  - [ ] Link claims to source_ids from `source_id_map`

- [ ] Create `apps/vicaran-agent/vicaran_agent/sub_agents/fact_checker.py`
  - [ ] **Read `claim_id_map` from session state to get claim IDs**
  - [ ] **Read `source_id_map` from session state to get source IDs**
  - [ ] Verify claims against source evidence
  - [ ] POST fact_checks with correct `claim_id` and `source_id`
  - [ ] Stream verification results per claim

- [ ] Create `apps/vicaran-agent/vicaran_agent/sub_agents/bias_analyzer.py`
  - [ ] Implement simplified bias scoring (0-10 scale)
  - [ ] **Quick mode**: Overall investigation bias only
  - [ ] **Detailed mode**: Per-source bias scores
  - [ ] POST bias analysis via callback API

- [ ] Create `apps/vicaran-agent/vicaran_agent/sub_agents/timeline_builder.py`
  - [ ] **Check `skip_timeline` flag in session state**
  - [ ] If skip: output `[TIMELINE_SKIPPED]` and return
  - [ ] Extract dates from sources
  - [ ] POST timeline_events via callback API

- [ ] Create `apps/vicaran-agent/vicaran_agent/sub_agents/summary_writer.py`
  - [ ] Generate investigation summary with citations
  - [ ] UPDATE investigation summary via callback API
  - [ ] Output `[INVESTIGATION_COMPLETE]` marker

- [ ] Create `apps/vicaran-agent/vicaran_agent/callbacks.py`
  - [ ] Implement `initialize_investigation_state` callback
  - [ ] **Implement `batch_save_sources` with `source_id_map` storage**
  - [ ] **Implement `batch_save_claims` with `claim_id_map` storage**
  - [ ] Implement `save_final_summary` callback

- [ ] Create `apps/vicaran-agent/vicaran_agent/tools/callback_api_tool.py`
  - [ ] Implement `callback_api_tool()` function
  - [ ] Use `X-Agent-Secret` header for authentication
  - [ ] **Return and parse created IDs from API response**
  - [ ] Handle error cases gracefully (don't break pipeline)


### Agent Configuration
[Goal: Configure agent for local development and production]

- [ ] Update `apps/vicaran-agent/.env.local`
  - [ ] Set `GOOGLE_CLOUD_PROJECT`
  - [ ] Set `GOOGLE_CLOUD_LOCATION`
  - [ ] Set `CALLBACK_API_URL=http://localhost:3000/api/agent-callback`
  - [ ] Set `AGENT_SECRET` (shared with web app)
  - [ ] Set `DATABASE_URL` (same as web app)

- [ ] Update `apps/web/.env.local`
  - [ ] Add `AGENT_SECRET` (same as agent)
  - [ ] Add `ADK_API_URL` for agent communication

### Agent System Validation
[Goal: Verify agent system works with web app before building UI]

- [ ] Run `adk run .` in `apps/vicaran-agent/` to test agent locally
- [ ] Verify agent can communicate with callback API
- [ ] Verify data appears in Supabase database tables
- [ ] Test with sample investigation topic

---

## Phase 5: Home Page & Investigation Setup

**Goal**: Build pages for starting and managing investigations

### Home Page Implementation
[Goal: Create welcome dashboard with recent investigations]

- [ ] Update `app/(protected)/home/page.tsx`
  - [ ] Add welcome message with user name
  - [ ] Add prominent "New Investigation" CTA button
  - [ ] Display recent investigations list (up to 5)
  - [ ] Add "View All" link to investigation history

- [ ] Create `components/home/RecentInvestigations.tsx`
  - [ ] Fetch recent investigations from database
  - [ ] Display title, mode, status, timestamp
  - [ ] Link each item to investigation workspace

### Investigation Setup Page
[Goal: Create investigation configuration form]

- [ ] Create `app/(protected)/investigations/new/page.tsx`
  - [ ] Add investigation title input (required)
  - [ ] Add investigation brief textarea (required)
  - [ ] Add initial sources section with URL inputs
  - [ ] Add mode selector (Quick Search / Detailed Inquiry)
  - [ ] Add "Start Investigation" button

- [ ] Create `components/investigations/SourceInput.tsx`
  - [ ] URL input with validation
  - [ ] Add/remove source functionality
  - [ ] Display list of added sources

- [ ] Create `components/investigations/ModeSelector.tsx`
  - [ ] Radio/toggle for Quick (~10 min) vs Detailed (~20 min)
  - [ ] Brief description of each mode

- [ ] Implement form submission
  - [ ] Call `createInvestigationAction()` server action
  - [ ] Trigger agent pipeline with investigation data
  - [ ] Redirect to investigation workspace

---

## Phase 6: Investigation Workspace

**Goal**: Build the core two-column investigation interface (Chat + Canvas)

### Workspace Layout
[Goal: Create responsive two-column layout for investigation work]

- [ ] Create `app/(protected)/investigations/[investigationId]/page.tsx`
  - [ ] Fetch investigation data on load
  - [ ] Implement 60/40 split layout (Chat/Canvas)
  - [ ] Add investigation title in header
  - [ ] Add Export PDF button in header

- [ ] Create `components/investigations/WorkspaceLayout.tsx`
  - [ ] Left column: Chat interface (60%)
  - [ ] Right column: Canvas with tabs (40%)
  - [ ] Responsive design for smaller screens

### Browser Refresh Recovery
[Goal: Handle page refresh without losing investigation state]

- [ ] Implement status-based recovery in workspace page
  - [ ] On load: check investigation.status from database
  - [ ] If status = "in_progress": start canvas polling immediately
  - [ ] If status = "pending_approval": show plan approval UI
  - [ ] If status = "completed": show final results

- [ ] Implement chat history reconnection
  - [ ] Store ADK session_id in investigation record
  - [ ] On refresh: reconnect to same ADK session
  - [ ] Fetch session history to restore chat messages
  - [ ] Resume SSE stream for new messages

### Chat Interface
[Goal: Display real-time agent conversation with streaming updates]

- [ ] Create `components/chat/ChatInterface.tsx`
  - [ ] Display message list with agent/user distinction
  - [ ] Implement SSE connection to agent stream
  - [ ] Show real-time progress updates
  - [ ] Add typing indicator when agent is processing

- [ ] Create `components/chat/ChatMessage.tsx`
  - [ ] Style agent messages (🤖 icon)
  - [ ] Style user messages (👤 icon)
  - [ ] Format message content with markdown

- [ ] Create `components/chat/MessageInput.tsx`
  - [ ] Text input with send button
  - [ ] "+" button placeholder (for future Add Source)
  - [ ] Submit message to agent

- [ ] Create `hooks/useAgentStream.ts`
  - [ ] Establish SSE connection to ADK agent
  - [ ] Handle connection lifecycle
  - [ ] Parse and dispatch incoming events

### Canvas with Tabs
[Goal: Display structured investigation data in organized tabs]

- [ ] Create `components/canvas/Canvas.tsx`
  - [ ] Tab navigation: Brief | Dashboard | Graph
  - [ ] Active tab state management

- [ ] Create `components/canvas/BriefTab.tsx`
  - [ ] Display auto-updating investigation summary
  - [ ] Fetch summary from investigation record
  - [ ] React Query with 3-second polling

- [ ] Create `components/canvas/DashboardTab.tsx`
  - [ ] Sub-tab navigation: 📰 Sources | 💬 Claims | ✓ Fact Checks | ⚖️ Bias | 📅 Timeline
  - [ ] Active sub-tab state management

### Dashboard Sub-Tabs
[Goal: Display structured data from agent analysis]

- [ ] Create `components/canvas/SourcesTab.tsx`
  - [ ] Fetch sources from database
  - [ ] Display source cards with:
    - [ ] Source title and URL
    - [ ] 5-star credibility rating
    - [ ] Content snippet
    - [ ] "View Source" external link

- [ ] Create `components/canvas/ClaimsTab.tsx`
  - [ ] Fetch claims from database
  - [ ] Display claim cards with:
    - [ ] Status icon (✅ Verified | ❓ Unverified | ❌ Contradicted)
    - [ ] Claim text
    - [ ] Source count and evidence count

- [ ] Create `components/canvas/FactChecksTab.tsx`
  - [ ] Fetch fact checks grouped by claim
  - [ ] Display evidence cards with:
    - [ ] ✅ SUPPORTING or ❌ CONTRADICTING label
    - [ ] Evidence text excerpt
    - [ ] Source attribution

- [ ] Create `components/canvas/BiasTab.tsx` (MVP Simplified)
  - [ ] Display overall investigation bias score (0-10)
  - [ ] Progress bar visualization
  - [ ] List sources with individual bias scores
  - [ ] Brief explanation text

- [ ] Create `components/canvas/TimelineTab.tsx` (MVP Simplified)
  - [ ] Fetch timeline events from database
  - [ ] Display as simple ordered list
  - [ ] Show date and event description
  - [ ] Link to source if available

- [ ] Create `hooks/useInvestigationData.ts`
  - [ ] React Query for fetching all investigation data
  - [ ] 3-second refetch interval for real-time updates
  - [ ] Separate queries for sources, claims, fact_checks, timeline

### Graph Tab (Claim Evidence Network)
[Goal: Create interactive visualization of source-claim relationships]

- [ ] Install React Flow and Dagre layout libraries
  ```bash
  npm install reactflow dagre @types/dagre
  ```

- [ ] Create `components/canvas/GraphTab.tsx`
  - [ ] React Flow canvas container
  - [ ] Legend component (Verified/Disputed/Investigating)
  - [ ] Zoom controls (+/- buttons, percentage display)
  - [ ] Export button for graph image
  - [ ] Node/Edge count display

- [ ] Create `components/canvas/graph/SourceNode.tsx`
  - [ ] Custom node component for sources
  - [ ] Display: source type badge (OFFICIAL/HUMINT/DATA/NEWS)
  - [ ] Display: source title and credibility stars
  - [ ] Color-coded badge based on source type

- [ ] Create `components/canvas/graph/ClaimNode.tsx`
  - [ ] Custom node component for claims
  - [ ] Display: status badge (VERIFIED/INVESTIGATING/DISPUTED)
  - [ ] Display: claim title and snippet
  - [ ] Color-coded border based on status (green/yellow/red)

- [ ] Create `components/canvas/graph/CustomEdge.tsx`
  - [ ] Edge styles: solid green (supports), dashed red (contradicts)
  - [ ] Edge labels for evidence type

- [ ] Create `hooks/useGraphData.ts`
  - [ ] Transform sources/claims/fact_checks into nodes and edges
  - [ ] Apply Dagre auto-layout (LR direction)
  - [ ] Handle node position updates on drag

- [ ] Implement Graph Tab interactions
  - [ ] Drag nodes to reposition (saved for session)
  - [ ] Hover: highlight connected edges, dim unrelated nodes
  - [ ] Click source: open source details panel
  - [ ] Click claim: show fact-check evidence panel
  - [ ] Double-click canvas: fit all nodes to viewport
  - [ ] Scroll to zoom, drag to pan


---

## Phase 7: Investigation History & PDF Export

**Goal**: Complete CRUD for investigations and add export functionality

### Investigation History Page
[Goal: Allow users to view and manage past investigations]

- [ ] Create `app/(protected)/investigations/page.tsx`
  - [ ] Fetch all user investigations
  - [ ] Add search input for filtering
  - [ ] Add status filter (All | Active | Completed)
  - [ ] Add mode filter (Quick Search | Detailed Inquiry)
  - [ ] Add sort dropdown (Newest first)

- [ ] Create `components/investigations/InvestigationCard.tsx`
  - [ ] Display title, mode, status, timestamp
  - [ ] Display stats (sources, claims, verified count)
  - [ ] Click to navigate to workspace
  - [ ] Delete button with confirmation modal

- [ ] Implement delete functionality
  - [ ] Call `deleteInvestigationAction()` server action
  - [ ] Cascade delete related records

### PDF Export
[Goal: Generate downloadable investigation report]

- [ ] Create `app/api/investigations/[id]/export/route.ts`
  - [ ] Fetch complete investigation data
  - [ ] Generate PDF using react-pdf or similar
  - [ ] Include: summary, sources, claims, fact checks
  - [ ] Return PDF as download

- [ ] Add Export button functionality in workspace
  - [ ] Call export API endpoint
  - [ ] Trigger browser download

- [ ] Create `lib/pdf/generateReport.ts`
  - [ ] Format investigation data for PDF
  - [ ] Include credibility ratings
  - [ ] Include verification status

---

## Phase 8: Navigation & Polish

**Goal**: Update sidebar navigation and polish the user experience

### Sidebar Navigation
[Goal: Create consistent navigation throughout the app]

- [ ] Update `components/navigation/Sidebar.tsx`
  - [ ] Add Vicaran logo at top
  - [ ] Add "New Investigation" primary CTA button
  - [ ] Add History section with recent investigations
  - [ ] Add "View All" link to history page
  - [ ] Add user profile section at bottom

- [ ] Update `components/navigation/UserMenu.tsx`
  - [ ] Display user avatar and name
  - [ ] Link to profile page
  - [ ] Sign out button

### Profile Page
[Goal: Complete user settings page]

- [ ] Update `app/(protected)/profile/page.tsx`
  - [ ] Display user info (name, email from Google)
  - [ ] Display account type (Google OAuth)
  - [ ] Add sign out button

### Final Polish
[Goal: Ensure consistent styling and error handling]

- [ ] Add loading states to all data-fetching components
- [ ] Add error boundaries for graceful error handling
- [ ] Verify responsive layout on tablet/mobile
- [ ] Test complete user flow end-to-end

---

## 🚀 Phase 9 (Post-Hackathon): Enhanced Features

**Goal**: Add deferred features after hackathon deadline

### Audit Trail Implementation
[Goal: Add transparency and logging for investigations]

- [ ] Create `drizzle/schema/audit-logs.ts`
  - [ ] Fields: id, investigation_id, action, details (JSONB), created_at
  - [ ] Add foreign key to investigations table

- [ ] Run database migration for audit_logs table

- [ ] Create `components/canvas/AuditTab.tsx`
  - [ ] Fetch audit logs from database
  - [ ] Display timestamped action log
  - [ ] Show action details

- [ ] Update agents to POST audit events to callback API

### Advanced Bias Analysis
[Goal: Detailed bias indicators for each source]

- [ ] Create `drizzle/schema/source-bias-indicators.ts`
  - [ ] Fields: id, source_id, indicator_type, confidence_score, details, created_at
  - [ ] Indicator types: emotional_language, selective_citation, political_framing

- [ ] Run database migration

- [ ] Update BiasTab to display detailed indicators
  - [ ] Framing comparison between sources
  - [ ] Individual indicator breakdown

- [ ] Update bias_analyzer agent for detailed analysis

### Mid-Investigation Source Addition
[Goal: Allow users to add sources during investigation]

- [ ] Create `components/chat/AddSourceModal.tsx`
  - [ ] URL input with validation
  - [ ] Submit to add-source API

- [ ] Create `app/api/investigations/[id]/add-source/route.ts`
  - [ ] Add source to database
  - [ ] Notify agent of new source

- [ ] Update agent to process mid-investigation sources

### Wayback Machine Fallback
[Goal: Recover content from unavailable URLs]

- [ ] Create `apps/vicaran-agent/vicaran_agent/tools/wayback.py`
  - [ ] Implement Wayback Machine API integration
  - [ ] Fetch archived content for unavailable URLs

- [ ] Update source_finder agent to use Wayback fallback

### Recursive Gap-Driven Search
[Goal: Automatically search to fill information gaps]

- [ ] Implement gap detection logic in agents
- [ ] Add iterative search loop
- [ ] Configure termination conditions

### Advanced Timeline Visualization
[Goal: Interactive chronological visualization]

- [ ] Replace simple list with timeline visualization component
- [ ] Add date range filtering
- [ ] Add interactive event details

### Export as Markdown
[Goal: Additional export format]

- [ ] Add Markdown export option
- [ ] Include citation chain
- [ ] Include methodology document

---

## 📊 Development Timeline (Recommended)

| Day | Phase | Focus |
|-----|-------|-------|
| **Day 1** | Phase 0 | Project Setup (SETUP.md) |
| **Day 2** | Phase 1-2 | Landing Page, Authentication |
| **Day 3** | Phase 3 | Database Schema, Callback API |
| **Day 4-5** | Phase 4 | Agent Orchestration (core agents) |
| **Day 6** | Phase 5 | Home Page, Investigation Setup |
| **Day 7** | Phase 6 | Investigation Workspace (Chat + Canvas) |
| **Day 8** | Phase 7 | History, PDF Export |
| **Day 9** | Phase 8 | Navigation, Polish, Demo Prep |
| **Post-Hackathon** | Phase 9 | Enhanced Features |

---

## ✅ Success Criteria

- [ ] User can sign in with Google OAuth
- [ ] User can create new investigation with title, brief, and optional sources
- [ ] Agent researches topic and streams updates to chat
- [ ] Dashboard tabs display: Sources (with ratings), Claims (with status), Fact Checks
- [ ] Graph tab displays interactive source-claim evidence network
- [ ] Brief tab shows auto-updating summary
- [ ] User can export investigation as PDF
- [ ] User can view and delete past investigations

---

> **Next Step:** Begin Phase 0 by running `SETUP.md` with gemini-2.5-pro on max mode
