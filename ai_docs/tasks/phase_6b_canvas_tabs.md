# Phase 6b: Canvas Tab Content - Brief & Dashboard

> **Task Type:** Feature Implementation
> **Priority:** High
> **Estimated Complexity:** Medium-High
> **Created:** 2026-02-08
> **Related Roadmap:** Phase 6 - Investigation Workspace (Part 2 of 3)
> **Depends On:** Phase 6a ✅ Complete

---

## 1. Task Overview

### Task Title
**Title:** Implement Canvas Tabs with Brief Summary and Dashboard Sub-Tabs

### Goal Statement
**Goal:** Replace the placeholder canvas content with functional Brief and Dashboard tabs. The Brief tab displays an auto-updating investigation summary. The Dashboard tab contains 5 sub-tabs (Sources, Claims, Fact Checks, Bias, Timeline) that display structured data from the database with 3-second polling for real-time updates.

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis
**SKIP STRATEGIC ANALYSIS** - The approach is already defined in the roadmap:
- Brief tab: Simple summary display with polling
- Dashboard: 5 sub-tabs with icon navigation
- Data fetching: React Query with 3-second refetch interval
- Existing database schema already has all required tables

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15, React 19
- **Language:** TypeScript 5.x with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS
- **Data Fetching:** React Query (already in project)
- **Key Patterns:** 
  - App Router with Server Components
  - Polling-based real-time updates (3-second interval)

### Current State

**Phase 6a Components (Completed):**
- `WorkspaceLayout.tsx` - Two-column layout with resizable divider
- `CanvasPanel.tsx` - Currently shows placeholder tabs

**Database Schema (Ready):**
- `investigations` table - Has `summary` field for Brief tab
- `sources` table - Has `title`, `url`, `credibility_score`, `snippet`
- `claims` table - Has `text`, `status` (verified/unverified/contradicted)
- `fact_checks` table - Has `claim_id`, `evidence_type`, `evidence_text`, `source_id`
- `timeline_events` table - Has `event_date`, `description`, `source_id`

**Existing Queries:**
- `lib/queries/sources.ts` - `getSources(investigationId)`
- `lib/queries/claims.ts` - `getClaims(investigationId)` (may need fact_checks join)
- `lib/queries/investigations.ts` - `getInvestigation(id, userId)`

### Existing Context Providers Analysis
- **UserContext (`useUser()`):** User data from authentication
- **SidebarProvider:** Sidebar state
- **ChatStateContext:** Chat messages and polling (separate from canvas)
- **No existing context for canvas data** - Will use React Query hooks directly

---

## 4. Context & Problem Definition

### Problem Statement
The `CanvasPanel.tsx` currently shows placeholder content for all tabs. Users need:
1. Brief tab with auto-updating investigation summary
2. Dashboard tab with organized sub-tabs showing investigation data
3. Real-time updates as agent discovers new sources, claims, and evidence
4. Clear visual indicators for claim status (verified/unverified/contradicted)

### Success Criteria
- [ ] Brief tab shows investigation summary from database
- [ ] Brief tab auto-updates every 3 seconds
- [ ] Dashboard has 5 sub-tabs with icons: 📰 Sources | 💬 Claims | ✓ Fact Checks | ⚖️ Bias | 📅 Timeline
- [ ] Sources tab shows source cards with credibility stars and snippets
- [ ] Claims tab shows claim cards with status icons (✅ ❓ ❌)
- [ ] Fact Checks tab shows evidence grouped by claim
- [ ] Bias tab shows overall score with progress bar (simplified for MVP)
- [ ] Timeline tab shows chrono-ordered events (inline rendering, no separate component)
- [ ] All tabs poll database every 3 seconds for updates (polling approved over SSE)
- [ ] Empty states show helpful messages when no data yet

> **✅ Confirmed Decisions (2026-02-08):**
> - **Audit Trail Tab**: Deferred to post-hackathon (requires additional callbacks/tables)
> - **Bias Tab**: Simple score bar only (framing comparison deferred)
> - **TimelineEvent**: Inlined in TimelineSubTab.tsx (no separate component)
> - **Graph Tab**: Placeholder for Phase 6c
> - **Polling**: Approved approach (3s interval for both chat and canvas)

---

## 5. Development Mode Context

- **🚨 IMPORTANT: This is a new application in active development**
- **No backwards compatibility concerns** - feel free to make breaking changes
- **Priority: Speed and simplicity** over data preservation
- **Desktop-first:** Focus on 1024px+ screens

---

## 6. Technical Requirements

### Functional Requirements

**Brief Tab:**
- Display investigation summary text (from `investigations.summary`)
- Show "Summary will appear here..." placeholder if no summary yet
- Auto-refresh every 3 seconds
- Format as markdown with line breaks

**Dashboard Tab Navigation:**
- 5 sub-tabs with icons: 📰 Sources | 💬 Claims | ✓ Fact Checks | ⚖️ Bias | 📅 Timeline
- Default to Sources tab
- Persist active tab in component state

**Sources Sub-Tab:**
- Show source cards with:
  - Source title (or domain name if no title)
  - ⭐ Credibility rating (1-5 stars based on `credibility_score`)
  - Content snippet (first 100 chars)
  - "View Source ↗" external link button
- Sort by credibility score descending

**Claims Sub-Tab:**
- Show claim cards with:
  - Status icon: ✅ Verified | ❓ Unverified | ❌ Contradicted
  - Claim text
  - Source count and evidence count (from fact_checks)
- Color-coded by status

**Fact Checks Sub-Tab:**
- Group by claim
- Show evidence cards with:
  - ✅ SUPPORTING or ❌ CONTRADICTING label
  - Evidence text excerpt
  - Source attribution (link to source)

**Bias Sub-Tab (Simplified for MVP):**
- Show overall bias score bar (0-10 scale)
- List sources with individual bias indicators
- Placeholder message if no bias data

**Timeline Sub-Tab:**
- Show events in chronological order
- Display date and event description
- Link to source if available
- Empty state if no timeline data

### Non-Functional Requirements
- **Performance:** 3-second polling interval for all tabs
- **Responsive:** Desktop-first, scroll within canvas area
- **Theme Support:** Light and dark mode
- **Accessibility:** Proper labels and keyboard navigation

### Technical Constraints
- Must use React Query for data fetching
- Must match existing tab styling from Phase 6a
- Canvas data polling is independent from chat polling

---

## 7. Data & Database Changes

### Database Schema Changes
**No database changes required.** All tables exist:
- `investigations.summary` for Brief tab
- `sources` table for Sources tab
- `claims` table for Claims tab
- `fact_checks` table for Fact Checks tab
- `timeline_events` table for Timeline tab

### Data Model Updates
**No schema updates needed.**

---

## 8. API & Backend Changes

### Data Access Pattern

#### QUERIES (Server Actions) → `app/actions/canvas.ts` (NEW)
Server actions for fetching canvas data (called from client with React Query):

```typescript
// app/actions/canvas.ts
"use server";

export async function getInvestigationSummary(investigationId: string, userId: string) {
  // Returns: { summary: string | null }
}

export async function getInvestigationSources(investigationId: string, userId: string) {
  // Returns: Source[] with title, url, credibility_score, snippet
}

export async function getInvestigationClaims(investigationId: string, userId: string) {
  // Returns: Claim[] with status, text, sourceCount, evidenceCount
}

export async function getInvestigationFactChecks(investigationId: string, userId: string) {
  // Returns: FactCheck[] grouped by claim
}

export async function getInvestigationTimeline(investigationId: string, userId: string) {
  // Returns: TimelineEvent[] with date, description, sourceUrl
}
```

### Why Server Actions (Not API Routes)
- Internal app feature, not external API
- Secure user authentication check in each action
- React Query can call server actions directly

---

## 9. Frontend Changes

### New Components

#### `components/canvas/BriefTab.tsx`
**Purpose:** Display auto-updating investigation summary
```typescript
interface BriefTabProps {
  investigationId: string;
}
```
- Fetches summary via `useInvestigationSummary` hook
- Displays formatted markdown
- Shows placeholder when empty

#### `components/canvas/DashboardTab.tsx`
**Purpose:** Container for 5 sub-tabs
```typescript
interface DashboardTabProps {
  investigationId: string;
}
```
- Sub-tab navigation with icons
- Renders active sub-tab component

#### `components/canvas/SourcesSubTab.tsx`
**Purpose:** Display source cards with credibility ratings
- Renders `SourceCard` for each source
- Sorted by credibility score

#### `components/canvas/SourceCard.tsx`
**Purpose:** Individual source display
```typescript
interface SourceCardProps {
  source: {
    id: string;
    title: string | null;
    url: string;
    credibility_score: number | null;
    snippet: string | null;
  };
}
```
- Star rating display (1-5)
- External link button

#### `components/canvas/ClaimsSubTab.tsx`
**Purpose:** Display claim cards with status
- Renders `ClaimCard` for each claim

#### `components/canvas/ClaimCard.tsx`
**Purpose:** Individual claim display
```typescript
interface ClaimCardProps {
  claim: {
    id: string;
    text: string;
    status: "verified" | "unverified" | "contradicted";
    sourceCount: number;
    evidenceCount: number;
  };
}
```
- Status icon and color
- Source/evidence counts

#### `components/canvas/FactChecksSubTab.tsx`
**Purpose:** Display evidence grouped by claim
- Groups fact checks by claim_id
- Renders evidence cards

#### `components/canvas/EvidenceCard.tsx`
**Purpose:** Individual evidence display
```typescript
interface EvidenceCardProps {
  evidence: {
    id: string;
    evidence_type: "supporting" | "contradicting";
    evidence_text: string;
    source_title: string;
    source_url: string;
  };
}
```

#### `components/canvas/BiasSubTab.tsx`
**Purpose:** Display bias analysis (simplified MVP)
- Overall bias score progress bar
- Per-source bias indicators

#### `components/canvas/TimelineSubTab.tsx`
**Purpose:** Display chronological events
- Renders timeline event list **inline** (no separate TimelineEvent component)
- Each event shows: date, description, optional source link

### New Hook

#### `hooks/useInvestigationData.ts`
**Purpose:** React Query hooks for canvas data
```typescript
export function useInvestigationSummary(investigationId: string, userId: string);
export function useInvestigationSources(investigationId: string, userId: string);
export function useInvestigationClaims(investigationId: string, userId: string);
export function useInvestigationFactChecks(investigationId: string, userId: string);
export function useInvestigationTimeline(investigationId: string, userId: string);
```
- 3-second refetch interval
- Enabled only when investigationId is valid

### Modified Components

#### `components/investigations/CanvasPanel.tsx`
**Changes:**
- Replace placeholder content with `BriefTab` and `DashboardTab`
- Pass `investigationId` prop to tabs
- Update tab switching logic

#### `components/investigations/WorkspaceLayout.tsx`
**Changes:**
- Pass `investigationId` to `CanvasPanel`

---

## 10. Code Changes Overview

### 📂 **Current Implementation (Before)**
```typescript
// components/investigations/CanvasPanel.tsx
// Shows placeholder for all tabs
<div className="flex-1 flex items-center justify-center p-8">
  <div className="text-center text-muted-foreground">
    <div className="text-4xl mb-4">🚧</div>
    <h3 className="text-lg font-medium mb-2">
      {activeTab === "brief" && "Brief Tab"}
    </h3>
    <p className="text-sm">Coming in Phase 6b</p>
  </div>
</div>
```

### 📂 **After Refactor**
```typescript
// components/investigations/CanvasPanel.tsx
<div className="flex-1 overflow-y-auto">
  {activeTab === "brief" && (
    <BriefTab investigationId={investigationId} />
  )}
  {activeTab === "dashboard" && (
    <DashboardTab investigationId={investigationId} />
  )}
  {activeTab === "graph" && (
    <GraphPlaceholder /> // Phase 6c
  )}
</div>
```

### 🎯 **Key Changes Summary**
- [ ] **2 modified components:** `CanvasPanel.tsx`, `WorkspaceLayout.tsx`
- [ ] **10 new components:** BriefTab, DashboardTab, SourcesSubTab, SourceCard, ClaimsSubTab, ClaimCard, FactChecksSubTab, EvidenceCard, BiasSubTab, TimelineSubTab
- [ ] **1 new hook file:** `useInvestigationData.ts`
- [ ] **1 new server action file:** `app/actions/canvas.ts`
- [ ] **1 placeholder component:** GraphPlaceholder (for Phase 6c)

---

## 11. Implementation Plan

### Phase 1: Create Data Fetching Layer
**Goal:** Set up server actions and React Query hooks

- [ ] **Task 1.1:** Create `app/actions/canvas.ts` with all 5 fetch functions
  - Files: `app/actions/canvas.ts`
  - Details: getInvestigationSummary, getInvestigationSources, getInvestigationClaims, getInvestigationFactChecks, getInvestigationTimeline

- [ ] **Task 1.2:** Create `hooks/useInvestigationData.ts`
  - Files: `hooks/useInvestigationData.ts`
  - Details: React Query hooks with 3-second refetch interval

### Phase 2: Create Brief Tab
**Goal:** Display auto-updating summary

- [ ] **Task 2.1:** Create `BriefTab.tsx`
  - Files: `components/canvas/BriefTab.tsx`
  - Details: Fetch and display summary with markdown formatting

### Phase 3: Create Dashboard Tab Structure
**Goal:** Set up sub-tab navigation

- [ ] **Task 3.1:** Create `DashboardTab.tsx`
  - Files: `components/canvas/DashboardTab.tsx`
  - Details: 5 sub-tabs with icons, state management

### Phase 4: Create Sub-Tab Components
**Goal:** Build all 5 sub-tabs with card components

- [ ] **Task 4.1:** Create `SourcesSubTab.tsx` and `SourceCard.tsx`
  - Files: `components/canvas/SourcesSubTab.tsx`, `components/canvas/SourceCard.tsx`
  - Details: Source list with credibility stars

- [ ] **Task 4.2:** Create `ClaimsSubTab.tsx` and `ClaimCard.tsx`
  - Files: `components/canvas/ClaimsSubTab.tsx`, `components/canvas/ClaimCard.tsx`
  - Details: Claims with status icons

- [ ] **Task 4.3:** Create `FactChecksSubTab.tsx` and `EvidenceCard.tsx`
  - Files: `components/canvas/FactChecksSubTab.tsx`, `components/canvas/EvidenceCard.tsx`
  - Details: Evidence grouped by claim

- [ ] **Task 4.4:** Create `BiasSubTab.tsx`
  - Files: `components/canvas/BiasSubTab.tsx`
  - Details: Bias score bar and indicators

- [ ] **Task 4.5:** Create `TimelineSubTab.tsx`
  - Files: `components/canvas/TimelineSubTab.tsx`
  - Details: Chronological event list

### Phase 5: Integrate with Canvas Panel
**Goal:** Wire everything together

- [ ] **Task 5.1:** Update `CanvasPanel.tsx` to render real tabs
  - Files: `components/investigations/CanvasPanel.tsx`
  - Details: Replace placeholder with BriefTab, DashboardTab, GraphPlaceholder

- [ ] **Task 5.2:** Update `WorkspaceLayout.tsx` to pass investigationId
  - Files: `components/investigations/WorkspaceLayout.tsx`
  - Details: Add investigationId prop to CanvasPanel

### Phase 6: Basic Code Validation (AI-Only)
**Goal:** Run safe static analysis only

- [ ] **Task 6.1:** TypeScript compilation check
  - Command: `cd apps/web && npx tsc --noEmit`
  - Details: Verify no type errors in new components

- [ ] **Task 6.2:** ESLint validation
  - Command: `cd apps/web && npm run lint`
  - Details: Check for linting issues

### Phase 7: User Browser Testing
**Goal:** Manual verification in browser

- [ ] **Task 7.1:** Test Brief tab displays summary
  - Test: Navigate to investigation with summary data
  - Expected: Summary text displays, updates every 3 seconds

- [ ] **Task 7.2:** Test Dashboard sub-tab navigation
  - Test: Click through all 5 sub-tabs
  - Expected: Each tab loads correct content

- [ ] **Task 7.3:** Test Sources tab with data
  - Test: View investigation with sources
  - Expected: Source cards, stars, links work

- [ ] **Task 7.4:** Test Claims tab with status icons
  - Test: View claims with different statuses
  - Expected: Correct icons and colors for each status

- [ ] **Task 7.5:** Test real-time updates
  - Test: Watch tab while agent adds data
  - Expected: New data appears within 3 seconds

- [ ] **Task 7.6:** Test empty states
  - Test: View investigation with no data yet
  - Expected: Helpful empty state messages

### Phase 8: Component Testing Implementation
**Goal:** Add basic tests for new components

- [ ] **Task 8.1:** Create test file for `useInvestigationData` hooks
  - Files: `hooks/__tests__/useInvestigationData.test.ts`
  - Details: Test React Query hooks with mock server actions
  - Tests: Hook returns data, handles loading state, handles errors, refetches on interval

- [ ] **Task 8.2:** Create test file for canvas server actions
  - Files: `app/actions/__tests__/canvas.test.ts`
  - Details: Test server actions return correct data shapes
  - Tests: Returns sources array, verifies user authorization, handles empty results

- [ ] **Task 8.3:** Create basic component tests for card components
  - Files: `components/canvas/__tests__/SourceCard.test.tsx`
  - Details: Test SourceCard renders correctly with different props
  - Tests: Displays title, shows stars for credibility, external link works

### Phase 9: Documentation Tasks
**Goal:** Document architecture decisions and update roadmap

- [ ] **Task 9.1:** Update roadmap with polling architecture documentation
  - Files: `ai_docs/prep/roadmap.md`
  - Details: Add section explaining polling vs SSE decision
  - Include:
    - Why polling was chosen over SSE
    - 3-second interval for both chat (ADK session) and canvas (Supabase DB)
    - Future SSE upgrade path when needed

- [ ] **Task 9.2:** Create polling architecture workflow document
  - Files: `.agent/workflows/polling-architecture.md`
  - Details: Document the data flow patterns for future reference
  - Include:
    - Chat polling flow diagram
    - Canvas polling flow diagram
    - Key files involved in each flow

---

## 12. Verification Plan

### Automated Tests
**No existing tests for canvas components.**

Static analysis verification:
1. TypeScript compilation: `cd apps/web && npx tsc --noEmit`
2. ESLint: `cd apps/web && npm run lint`
3. Build check: `cd apps/web && npm run build`

### Manual Verification (User Required)

**Test 1: Brief Tab**
1. Start dev server: `cd apps/web && npm run dev`
2. Navigate to an investigation with summary data
3. Verify: Summary text displays in Brief tab
4. If running agent: Verify summary updates as agent progresses

**Test 2: Sources Tab**
1. Navigate to investigation with sources
2. Click "DASHBOARD" tab, then Sources sub-tab (📰)
3. Verify: Source cards show with:
   - Title/domain
   - Star rating (1-5 stars)
   - Snippet text
   - "View ↗" link opens source

**Test 3: Claims Tab**
1. Click Claims sub-tab (💬)
2. Verify: Claims show with status icons:
   - ✅ green for verified
   - ❓ yellow for unverified
   - ❌ red for contradicted
3. Verify: Source and evidence counts display

**Test 4: Fact Checks Tab**
1. Click Fact Checks sub-tab (✓)
2. Verify: Evidence cards grouped by claim
3. Verify: Supporting/Contradicting labels correct

**Test 5: Timeline Tab**
1. Click Timeline sub-tab (📅)
2. Verify: Events show in date order
3. Verify: Source links work

**Test 6: Real-time Updates**
1. Leave Dashboard open during active investigation
2. Wait for agent to add new data (or add via database)
3. Verify: New data appears within 3-6 seconds

---

## 13. File Structure Summary

### New Files to Create
```
components/canvas/
├── BriefTab.tsx           # Summary display
├── DashboardTab.tsx       # Sub-tab container
├── SourcesSubTab.tsx      # Sources list
├── SourceCard.tsx         # Individual source
├── ClaimsSubTab.tsx       # Claims list
├── ClaimCard.tsx          # Individual claim
├── FactChecksSubTab.tsx   # Fact checks list
├── EvidenceCard.tsx       # Individual evidence
├── BiasSubTab.tsx         # Bias analysis (simple score bar)
├── TimelineSubTab.tsx     # Timeline events (inline rendering)
└── GraphPlaceholder.tsx   # Placeholder for Phase 6c

hooks/
└── useInvestigationData.ts  # React Query hooks (3s polling)

app/actions/
└── canvas.ts               # Server actions for data fetching
```

> **Note:** TimelineEvent.tsx removed - events rendered inline in TimelineSubTab.tsx

### Files to Modify
```
components/investigations/
├── CanvasPanel.tsx         # Replace placeholder with real tabs
└── WorkspaceLayout.tsx     # Pass investigationId prop
```

---

## 14. Dependencies & Imports

### No new npm packages required
React Query already installed:
- `@tanstack/react-query`

### Key Imports
```typescript
import { useQuery } from "@tanstack/react-query";
import { getInvestigationSources } from "@/app/actions/canvas";
import { useUser } from "@/contexts/UserContext";
```

---

## 15. Notes & Considerations

### What's Deferred to Phase 6c
- Graph tab with React Flow
- Source-claim network visualization
- Interactive node/edge graphs

### Edge Cases to Handle
1. **No summary yet:** Show "Summary will appear as investigation progresses..."
2. **No sources yet:** Show "Sources will appear as agent discovers them..."
3. **Empty claims:** Show encouraging message about claim extraction
4. **No timeline data:** Show "Timeline events will appear..." or skip tab
5. **Polling errors:** Silent retry, no toast spam

### MVP Simplifications (✅ Confirmed)
- **Bias tab**: Simple score bar only, no detailed framing comparison (deferred)
- **Timeline tab**: Simple list with inline rendering, no interactive visualization
- **Audit trail tab**: Deferred to post-hackathon (requires additional callbacks/tables)
- **Polling vs SSE**: Polling approved (simpler, works with local ADK + Agent Engine)

---

## 16. Ready to Implement

Once approved, implementation will:
1. Create **10 new component files** (TimelineEvent inlined)
2. Create 1 new hook file
3. Create 1 new server action file
4. Modify 2 existing components
5. Implement 3-second polling for all canvas data (✅ approved)
6. Add 3 test files for hooks, server actions, and components
7. Document polling architecture in roadmap and create workflow file

**Estimated time:** 4-5 hours of implementation + testing + documentation

---

## 17. Decision Log

| Decision | Choice | Rationale |
|----------|--------|--------|
| Audit Trail Tab | Deferred | Requires additional callback types and DB tables |
| Bias Framing Comparison | Deferred | Significant UI complexity, simple bar tells the story |
| TimelineEvent Component | Inlined | Simple rendering, no reuse needed |
| Graph Tab | Phase 6c | Uses React Flow + Dagre, needs own phase |
| Real-time Updates | Polling (3s) | Works with local ADK + Agent Engine, simpler to debug |

---

## 18. Implementation Status & Bug Fixes (2026-02-08 / 2026-02-09)

### ✅ Phase 6b Implementation Complete

All planned components were created and are working:
- **Brief Tab**: Auto-updating investigation summary ✅
- **Dashboard Tab**: 5 sub-tabs with icon navigation ✅
- **Sources Sub-Tab**: Displaying source cards with credibility ratings ✅
- **Claims Sub-Tab**: Displaying claims with status icons ✅
- **Fact Checks Sub-Tab**: Evidence grouped by claim ✅
- **Bias Sub-Tab**: Overall bias score with progress bar ✅
- **Timeline Sub-Tab**: Chronological events with source links ✅

---

### 🐛 Critical Bugs Discovered & Fixed

#### Bug #1: Investigation Data Not Saving to Correct Investigation

**Symptom:** Sources, claims, and other investigation data were being saved, but not appearing in the canvas. Investigation status remained "pending".

**Root Cause Analysis:**

The `INVESTIGATION_STARTED` callback was not firing because the `investigation_id` was not being extracted from the user message. Two issues were discovered:

1. **Session State Key**: The agent callback was reading from `session_state.get("user_prompt", "")` but this key was **never populated** by the ADK framework. The actual user message is stored in `session.events`.

2. **Mock ID Generation**: When the ID wasn't found, debug mode was generating a mock UUID, causing data to be saved under the wrong investigation.

**Files Changed:**
- `apps/vicaran-agent/vicaran_agent/callbacks.py`

**Fix Applied:**
```python
# BEFORE: Reading from non-existent state key
user_prompt = session_state.get("user_prompt", "")

# AFTER: Extract from session events (where ADK stores messages)
session = callback_context._invocation_context.session
user_prompt = ""
for event in reversed(session.events or []):
    if hasattr(event, 'content') and event.content:
        if hasattr(event.content, 'role') and event.content.role == 'user':
            if hasattr(event.content, 'parts'):
                for part in event.content.parts:
                    if hasattr(part, 'text') and part.text:
                        user_prompt = part.text
                        break
    if user_prompt:
        break
```

Also removed mock ID generation to prevent data from being saved under wrong investigations:
```python
# BEFORE: Generated mock ID in debug mode
elif config.debug_mode:
    mock_id = str(uuid.uuid4())
    session_state["investigation_id"] = mock_id

# AFTER: Log error and skip callbacks when ID not found
else:
    print("❌ ERROR: No investigation_id found in user message. Callbacks will be skipped.")
    session_state["investigation_id"] = ""
```

---

#### Bug #2: Bias Canvas Not Displaying Data

**Symptom:** Bias tab showed "No Bias Analysis Yet" even though:
- Chat showed "Bias Analyzer - Saved bias for source_id: xxx"
- Summary contained "Overall bias score: 1.86/10"
- Database had `overall_bias_score: NULL` in investigations table

**Root Cause Analysis:**

The `save_final_summary` callback in `callbacks.py` was sending the `INVESTIGATION_COMPLETE` callback, but it didn't extract and include the `overall_bias_score` from the summary text.

**Files Changed:**
- `apps/vicaran-agent/vicaran_agent/callbacks.py`
- `apps/web/components/canvas/BiasSubTab.tsx`

**Fix 1 - Agent Callback (extract and send bias score):**
```python
# Added regex extraction of bias score from summary
bias_match = re.search(r"Overall bias score:\s*([\d.]+)/10", investigation_summary, re.IGNORECASE)
if bias_match:
    try:
        # Convert from 0-10 (agent) to 0-5 (API schema) scale
        score_10 = float(bias_match.group(1))
        overall_bias_score = score_10 / 2
    except ValueError:
        pass

# Added to payload
payload = {
    "type": "INVESTIGATION_COMPLETE",
    "investigation_id": investigation_id,
    "data": {
        "summary": investigation_summary,
        "overall_bias_score": overall_bias_score,  # NEW
    },
}
```

**Fix 2 - Frontend Component (scale conversion):**
```typescript
// BiasSubTab.tsx - Convert from 0-5 (database) to 0-10 (display) scale
function parseBiasScore(score: string | null): number | null {
    if (!score) return null;
    const parsed = parseFloat(score);
    if (isNaN(parsed)) return null;
    // Convert from 0-5 (database) to 0-10 (display) scale
    return parsed * 2;
}
```

---

#### Bug #3: Timeline Not Displaying

**Symptom:** Timeline tab showed "No Timeline Yet"

**Root Cause:** This is **expected behavior** for "quick" mode investigations. The summary contains:
```
[TIMELINE_SKIPPED] Quick Search mode - timeline construction disabled.
```

**Resolution:** Not a bug - timeline only runs in "detailed" mode. The empty state message is correct.

---

#### Bug #4: React Hydration Mismatch Error

**Symptom:** Console error: "Hydration failed because the server rendered HTML didn't match the client"

**Root Cause:** Dynamic message content (timestamps, agent names) differed between server and client render.

**Files Changed:**
- `apps/web/components/chat/MessageList.tsx`

**Fix Applied:**
```tsx
// Added suppressHydrationWarning to AgentHeader divs
function AgentHeader({ message }: { message: Message }) {
  return (
    <div className="mb-3 sm:mb-4" suppressHydrationWarning>
      <div className="flex items-center gap-2 flex-wrap" suppressHydrationWarning>
        {/* ... */}
      </div>
    </div>
  );
}
```

---

### 📊 Data Flow Architecture (Verified Working)

```
[User Clicks "Start Investigation"]
         ↓
[Frontend sends message with "Investigation ID: uuid"]
         ↓
[ADK /run API receives message]
         ↓
[Agent callback extracts ID from session.events]
         ↓
[INVESTIGATION_STARTED callback → DB status = "in_progress"]
         ↓
[Agent runs → sources, claims, fact_checks, timeline saved via callbacks]
         ↓
[INVESTIGATION_COMPLETE callback → summary + overall_bias_score saved]
         ↓
[Canvas polling (3s) fetches data → displays in tabs]
```

---

### 🔧 Key Configuration

**Agent Environment (`apps/vicaran-agent/vicaran_agent/.env.local`):**
```
DEBUG_MODE=true                    # Enables verbose callback logging
CALLBACK_API_URL=http://localhost:3000/api/agent-callback
AGENT_SECRET=matching-secret       # Must match web app
```

**Web Environment (`apps/web/.env.local`):**
```
AGENT_SECRET=matching-secret       # Must match agent
```

---

### 📝 Lessons Learned

1. **ADK Session Events**: The ADK framework stores user messages in `session.events`, not in a `user_prompt` state key. Always extract from events.

2. **Scale Consistency**: When data flows through multiple layers (Agent 0-10 → API 0-5 → DB → Frontend 0-10), document scale conversions clearly.

3. **Debug Mode Mock IDs**: Mock ID generation in debug mode can mask real bugs. Prefer failing loudly when IDs are missing.

4. **Hydration Warnings**: Use `suppressHydrationWarning` on elements that contain client-specific data like timestamps.

5. **Detailed Logging**: The `🚀 CALLBACK FIRED:` and `✅ RESPONSE:` logs were essential for debugging the data flow.

---

### ✅ Final Verification

| Feature | Status | Notes |
|---------|--------|-------|
| Sources Tab | ✅ Working | Cards display with View Source links |
| Claims Tab | ✅ Working | Status icons show correctly |
| Fact Checks Tab | ✅ Working | Evidence grouped by claim |
| Bias Tab | ✅ Working | Score bar displays after fix |
| Timeline Tab | ✅ Expected Empty | Only in detailed mode |
| Brief Tab | ✅ Working | Summary auto-updates |
| 3s Polling | ✅ Working | Data refreshes in real-time |
| Hydration | ✅ Fixed | No more console errors |
