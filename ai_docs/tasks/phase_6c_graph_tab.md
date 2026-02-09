# Phase 6c: Graph Tab (Claim Evidence Network)

> **Task Type:** Feature Implementation
> **Priority:** High
> **Estimated Complexity:** Medium-High
> **Created:** 2026-02-09
> **Related Roadmap:** Phase 6 - Investigation Workspace (Part 3 of 3)
> **Depends On:** Phase 6a ✅ Complete, Phase 6b ✅ Complete

---

## 1. Task Overview

### Task Title
**Title:** Implement Interactive Graph Tab with React Flow Visualization

### Goal Statement
**Goal:** Replace the `GraphPlaceholder.tsx` component with a fully functional React Flow-based graph visualization. The Graph tab will display an interactive claim-evidence network showing relationships between sources and claims, with custom node components for sources and claims, edge styling for evidence types (supporting/contradicting), and interactive features including drag-to-reposition, hover highlighting, and click-to-expand panels.

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis
**SKIP STRATEGIC ANALYSIS** - The approach is already defined in the roadmap:
- React Flow + Dagre layout libraries specified
- Node types and styling defined in `edge_cases_and_behaviors.md`
- Interaction patterns documented (hover, click, drag, etc.)
- Data model clearly specified

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15, React 19
- **Language:** TypeScript 5.x with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS
- **Data Fetching:** Polling-based (3-second interval) via `useCanvasPolling.ts`
- **Key Patterns:** 
  - App Router with Server Components
  - Polling-based real-time updates
  - Canvas data already available via existing hook

### Current State

**Phase 6b Components (Completed):**
- `CanvasPanel.tsx` - Tab container with BRIEF | DASHBOARD | GRAPH tabs
- `GraphPlaceholder.tsx` - Current placeholder showing "Coming in Phase 6c"
- `useCanvasPolling.ts` - Already fetches sources, claims, and factChecks data

**Existing Data Available (from `useCanvasPolling`):**
- `sources: Source[]` - Source nodes with id, url, title, credibility_score, bias_score
- `claims: Claim[]` - Claim nodes with id, claim_text, status (verified/unverified/contradicted)
- `factChecks: FactCheckWithSource[]` - Edges with claim_id, source_id, evidence_type

**Database Schema (Ready):**
- `sources` table: id, url, title, credibility_score, bias_score
- `claims` table: id, claim_text, status (verified/unverified/contradicted)
- `fact_checks` table: claim_id, source_id, evidence_type (supporting/contradicting), evidence_text

### Existing Context Providers Analysis
- **UserContext (`useUser()`):** User data from authentication
- **Canvas data:** Available via `useCanvasPolling` hook - no new context needed
- **No new context providers needed** - data already flows via props

---

## 4. Context & Problem Definition

### Problem Statement
The `GraphPlaceholder.tsx` currently shows a placeholder message. Users need:
1. Visual representation of claim-source relationships
2. Ability to understand evidence flow at a glance
3. Interactive exploration of connections
4. Clear visual distinction between verified/disputed claims and supporting/contradicting evidence

### Success Criteria
- [ ] React Flow and Dagre libraries installed correctly
- [ ] `GraphTab.tsx` replaces `GraphPlaceholder.tsx` with React Flow canvas
- [ ] Custom `SourceNode.tsx` displays title (or domain) and credibility stars (NO source type badges for MVP)
- [ ] Custom `ClaimNode.tsx` displays status badge, claim title, and status-based border color
- [ ] `CustomEdge.tsx` renders solid green (supports) or dashed red (contradicts) edges
- [ ] `useGraphData.ts` transforms canvas data into React Flow nodes/edges
- [ ] Dagre auto-layout positions sources on left, claims on right (LR direction)
- [ ] Nodes are draggable to reposition (position saved for session)
- [ ] Hover on node shows simple shadow/glow effect
- [ ] Click on source opens source details panel
- [ ] Click on claim shows fact-check evidence panel
- [ ] Zoom controls (+/- buttons) and pan/scroll work correctly
- [ ] Legend showing status colors (Verified/Disputed/Investigating)
- [ ] Node/Edge count display in footer
- [ ] Graph updates automatically when canvas data updates via polling

---

## 5. Development Mode Context

- **🚨 IMPORTANT: This is a new application in active development**
- **No backwards compatibility concerns** - feel free to make breaking changes
- **Priority: Speed and simplicity** over data preservation
- **Desktop-first:** Focus on 1024px+ screens

---

## 6. Technical Requirements

### Functional Requirements

**Graph Canvas:**
- Display React Flow canvas with sources and claims as nodes
- Edge connections represent fact_checks (evidence linking source to claim)
- Auto-layout using Dagre (LR direction: sources left, claims right)

**Source Nodes (MVP - No source type badges):**
- Display source title (or domain if no title)
- Display credibility rating (1-5 stars)
- Simple styling (source type badges deferred to post-hackathon)

**Claim Nodes:**
- Display status badge (VERIFIED ✓ / INVESTIGATING ⏳ / DISPUTED ✗)
- Display claim title (truncated) and snippet
- Color-coded border based on status:
  - Verified: Green (#22c55e)
  - Under Investigation/Unverified: Yellow (#eab308)
  - Disputed/Contradicted: Red (#ef4444)

**Edges:**
- Supporting evidence: Solid green line
- Contradicting evidence: Dashed red line
- Optional: Edge label showing evidence type

**Interactions:**
- Drag nodes to reposition (saved for session, not persisted)
- Hover: simple shadow/glow effect on hovered node (MVP simplification)
- Click source: show source details in panel
- Click claim: show fact-check evidence in panel
- Double-click canvas: fit all nodes to viewport
- Scroll to zoom, drag to pan

**Controls:**
- Use React Flow's built-in `<Controls />` component for zoom (+/-/fit)
- Legend component (Verified/Disputed/Investigating)
- Node/Edge count display
- Export button placeholder (future feature)

### Non-Functional Requirements
- **Performance:** Smooth interactions, handle up to 50 nodes without lag
- **Responsive:** Desktop-first, scrollable canvas
- **Theme Support:** Light and dark mode colors
- **Accessibility:** Keyboard navigation for zoom controls

### Technical Constraints
- Must use React Flow v11 (latest stable)
- Must use Dagre for auto-layout
- Must reuse existing `useCanvasPolling` data (no new data fetching)
- Must work within existing CanvasPanel tab structure

---

## 7. Data & Database Changes

### Database Schema Changes
**No database changes required.** All data already exists:
- `sources` table provides source nodes
- `claims` table provides claim nodes
- `fact_checks` table provides edges with evidence_type

### Data Model Updates
**No schema updates needed.** Will transform existing data types.

---

## 8. API & Backend Changes

### Data Access Pattern
**No new server actions or API routes needed.**

Existing data from `useCanvasPolling` provides:
- `sources: Source[]` → Transform to Source nodes
- `claims: Claim[]` → Transform to Claim nodes
- `factChecks: FactCheckWithSource[]` → Transform to edges

### Server Actions
**Existing actions to reuse (no modifications):**
- `getInvestigationSources()`
- `getInvestigationClaims()`
- `getInvestigationFactChecks()`

All fetched via `useCanvasPolling` hook - no changes required.

---

## 9. Frontend Changes

### New Components

#### `components/canvas/GraphTab.tsx`
**Purpose:** React Flow canvas container
```typescript
interface GraphTabProps {
    investigationId: string;
    sources: Source[];
    claims: Claim[];
    factChecks: FactCheckWithSource[];
}
```
- React Flow Provider wrapper
- Zoom/pan controls
- Legend component
- Node/Edge count display
- Handles node interactions (click, hover)

#### `components/canvas/graph/SourceNode.tsx`
**Purpose:** Custom React Flow node for sources
```typescript
interface SourceNodeData {
    sourceId: string;
    title: string;
    url: string;
    domain: string;
    credibilityScore: number;
}
```
- Title display (or domain fallback)
- Star rating for credibility
- Clean, minimal design (no source type badges for MVP)

#### `components/canvas/graph/ClaimNode.tsx`
**Purpose:** Custom React Flow node for claims
```typescript
interface ClaimNodeData {
    claimId: string;
    title: string;
    snippet: string;
    status: 'verified' | 'unverified' | 'contradicted';
}
```
- Status badge with color
- Claim text display
- Border color based on status

#### `components/canvas/graph/CustomEdge.tsx`
**Purpose:** Custom edge with evidence styling
- Solid green for supporting
- Dashed red for contradicting

#### `components/canvas/graph/GraphLegend.tsx`
**Purpose:** Legend component showing node/edge colors
- Status legend (Verified/Investigating/Disputed)
- Edge type legend (Supports/Contradicts)

#### `components/canvas/graph/GraphControls.tsx`
**Purpose:** Additional graph controls (may be minimal since using React Flow built-in Controls)
- Node/Edge count display
- Fit-to-view button (optional, already in built-in Controls)

#### `components/canvas/graph/SourceDetailPanel.tsx`
**Purpose:** Slide-out panel on the right side (overlays graph) showing source details
- Animated slide-in from right edge
- Full title and URL
- Credibility rating (stars)
- Content snippet
- Link to original source
- Close button (X) to dismiss

#### `components/canvas/graph/ClaimDetailPanel.tsx`
**Purpose:** Slide-out panel on the right side (overlays graph) showing claim details
- Animated slide-in from right edge
- Full claim text
- Status with explanation
- List of supporting/contradicting evidence
- Close button (X) to dismiss

### New Hook

#### `hooks/useGraphData.ts`
**Purpose:** Transform canvas data into React Flow format
```typescript
interface UseGraphDataProps {
    sources: Source[];
    claims: Claim[];
    factChecks: FactCheckWithSource[];
}

interface UseGraphDataReturn {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
}
```
- Transforms sources to source nodes
- Transforms claims to claim nodes
- Transforms factChecks to edges
- Applies Dagre layout
- Manages node position state for dragging

### Modified Components

#### `components/canvas/CanvasPanel.tsx`
**Changes:**
- Replace `<GraphPlaceholder />` with `<GraphTab />`
- Pass required data props to GraphTab

---

## 10. Code Changes Overview

### 📂 **Current Implementation (Before)**
```typescript
// components/canvas/GraphPlaceholder.tsx
export function GraphPlaceholder(): React.JSX.Element {
    return (
        <div className="flex h-full items-center justify-center p-8">
            <div className="text-center text-muted-foreground max-w-md">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-lg font-medium mb-2">Graph View Coming Soon</h3>
                <p className="text-sm mb-4">
                    The interactive claim-evidence network graph will be available in
                    Phase 6c...
                </p>
            </div>
        </div>
    );
}
```

### 📂 **After Refactor**
```typescript
// components/canvas/GraphTab.tsx
export function GraphTab({
    investigationId,
    sources,
    claims,
    factChecks,
}: GraphTabProps): React.JSX.Element {
    const { nodes, edges, onNodesChange, onEdgesChange } = useGraphData({
        sources,
        claims,
        factChecks,
    });

    return (
        <div className="h-full w-full">
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                >
                    <Controls />
                    <Background />
                    <GraphLegend />
                    <GraphControls />
                </ReactFlow>
            </ReactFlowProvider>
            
            {/* Detail panels */}
            {selectedSource && <SourceDetailPanel source={selectedSource} />}
            {selectedClaim && <ClaimDetailPanel claim={selectedClaim} />}
        </div>
    );
}
```

### 🎯 **Key Changes Summary**
- [ ] **Replace GraphPlaceholder:** Full React Flow implementation
- [ ] **8 new component files:** GraphTab, SourceNode, ClaimNode, CustomEdge, GraphLegend, GraphControls, SourceDetailPanel, ClaimDetailPanel
- [ ] **1 new hook file:** `useGraphData.ts`
- [ ] **1 modified component:** `CanvasPanel.tsx`
- [ ] **2 new npm packages:** `reactflow`, `dagre` + `@types/dagre`

---

## 11. Implementation Plan

### Phase 1: Install Dependencies
**Goal:** Add React Flow and Dagre libraries

- [ ] **Task 1.1:** Install npm packages
  - Command: `cd apps/web && npm install reactflow dagre @types/dagre`
  - Details: Install React Flow v11+ and Dagre for auto-layout

### Phase 2: Create Graph Data Hook
**Goal:** Transform canvas data into React Flow format

- [ ] **Task 2.1:** Create `hooks/useGraphData.ts`
  - Files: `hooks/useGraphData.ts`
  - Details: Transform sources/claims/factChecks into nodes and edges, apply Dagre layout

### Phase 3: Create Custom Node Components
**Goal:** Build source and claim node components

- [ ] **Task 3.1:** Create `components/canvas/graph/SourceNode.tsx`
  - Files: `components/canvas/graph/SourceNode.tsx`
  - Details: Custom node with title (or domain), credibility stars (no source type badges for MVP)

- [ ] **Task 3.2:** Create `components/canvas/graph/ClaimNode.tsx`
  - Files: `components/canvas/graph/ClaimNode.tsx`
  - Details: Custom node with status badge, claim text, colored border

### Phase 4: Create Edge and Control Components
**Goal:** Build edge styling and control components

- [ ] **Task 4.1:** Create `components/canvas/graph/CustomEdge.tsx`
  - Files: `components/canvas/graph/CustomEdge.tsx`
  - Details: Solid green for supports, dashed red for contradicts

- [ ] **Task 4.2:** Create `components/canvas/graph/GraphLegend.tsx`
  - Files: `components/canvas/graph/GraphLegend.tsx`
  - Details: Status and edge type legend

- [ ] **Task 4.3:** Create `components/canvas/graph/GraphControls.tsx`
  - Files: `components/canvas/graph/GraphControls.tsx`
  - Details: Node/Edge count display (zoom handled by React Flow built-in Controls)

### Phase 5: Create Detail Panels
**Goal:** Build click-to-expand detail panels

- [ ] **Task 5.1:** Create `components/canvas/graph/SourceDetailPanel.tsx`
  - Files: `components/canvas/graph/SourceDetailPanel.tsx`
  - Details: Full source details on click

- [ ] **Task 5.2:** Create `components/canvas/graph/ClaimDetailPanel.tsx`
  - Files: `components/canvas/graph/ClaimDetailPanel.tsx`
  - Details: Claim details with evidence list

### Phase 6: Create Main Graph Tab Component
**Goal:** Integrate all pieces into GraphTab

- [ ] **Task 6.1:** Create `components/canvas/GraphTab.tsx`
  - Files: `components/canvas/GraphTab.tsx`
  - Details: Main React Flow container, node type registration, interaction handlers

### Phase 7: Integrate with Canvas Panel
**Goal:** Replace placeholder with real graph

- [ ] **Task 7.1:** Update `CanvasPanel.tsx`
  - Files: `components/investigations/CanvasPanel.tsx`
  - Details: Replace GraphPlaceholder with GraphTab, pass data props

### Phase 8: Basic Code Validation (AI-Only)
**Goal:** Run safe static analysis only

- [ ] **Task 8.1:** TypeScript compilation check
  - Command: `cd apps/web && npx tsc --noEmit`
  - Details: Verify no type errors in new components

- [ ] **Task 8.2:** ESLint validation
  - Command: `cd apps/web && npm run lint`
  - Details: Check for linting issues

### Phase 9: User Browser Testing
**Goal:** Manual verification in browser

- [ ] **Task 9.1:** Test graph renders with data
  - Test: Navigate to investigation with sources and claims
  - Expected: Graph shows nodes and edges correctly

- [ ] **Task 9.2:** Test node styling
  - Test: Verify source and claim nodes have correct colors and badges
  - Expected: Sources show type badges, claims show status badges

- [ ] **Task 9.3:** Test edge styling
  - Test: Verify supporting edges are solid green, contradicting are dashed red
  - Expected: Edge styles match evidence type

- [ ] **Task 9.4:** Test drag interaction
  - Test: Drag nodes to reposition
  - Expected: Nodes move smoothly, stay in new position

- [ ] **Task 9.5:** Test zoom and pan
  - Test: Use scroll wheel to zoom, drag canvas to pan
  - Expected: Smooth zoom and pan behavior

- [ ] **Task 9.6:** Test click interactions
  - Test: Click on source node, then claim node
  - Expected: Detail panels open with correct information

- [ ] **Task 9.7:** Test hover highlighting
  - Test: Hover over a node
  - Expected: Connected edges highlighted, unrelated nodes dimmed

- [ ] **Task 9.8:** Test real-time updates
  - Test: Leave graph open while agent adds data
  - Expected: New nodes/edges appear via polling updates

- [ ] **Task 9.9:** Test empty state
  - Test: View graph for investigation with no data yet
  - Expected: Helpful empty state message

---

## 12. Verification Plan

### Automated Tests
**No existing tests for canvas components.**

Static analysis verification:
1. TypeScript compilation: `cd apps/web && npx tsc --noEmit`
2. ESLint: `cd apps/web && npm run lint`

### Manual Verification (User Required)

**Test 1: Graph Rendering**
1. Start dev server (already running)
2. Navigate to an investigation with sources and claims
3. Click the "GRAPH" tab in the canvas panel
4. Verify: Graph displays with source nodes on left, claim nodes on right
5. Verify: Edges connect sources to claims

**Test 2: Node Styling**
1. Check source nodes:
   - Source type badge visible (e.g., "NEWS", "OFFICIAL")
   - Title displayed
   - Credibility stars shown (1-5)
2. Check claim nodes:
   - Status badge visible (✓ Verified, ⏳ Investigating, ✗ Disputed)
   - Claim text displayed
   - Border color matches status (green/yellow/red)

**Test 3: Edge Styling**
1. Locate a supporting evidence edge
2. Verify: Solid green line
3. Locate a contradicting evidence edge
4. Verify: Dashed red line

**Test 4: Interactions**
1. Drag a node: Should move and stay in position
2. Scroll to zoom: Should zoom smoothly
3. Drag canvas: Should pan view
4. Click source node: Should open detail panel
5. Click claim node: Should open detail panel with evidence
6. Click +/- buttons: Should zoom in/out
7. Double-click canvas: Should fit all nodes to view

**Test 5: Hover Effects**
1. Hover over a source node
2. Verify: Connected edges are highlighted
3. Verify: Unrelated nodes are dimmed

**Test 6: Real-time Updates**
1. Keep graph open during active investigation
2. Wait for agent to add new data
3. Verify: New nodes/edges appear within 3-6 seconds

---

## 13. File Structure Summary

### New Files to Create
```
components/canvas/graph/
├── SourceNode.tsx           # Custom source node component
├── ClaimNode.tsx            # Custom claim node component
├── CustomEdge.tsx           # Custom edge with evidence styling
├── GraphLegend.tsx          # Status and edge type legend
├── GraphControls.tsx        # Zoom +/- buttons
├── SourceDetailPanel.tsx    # Source details on click
└── ClaimDetailPanel.tsx     # Claim details on click

components/canvas/
└── GraphTab.tsx             # Main React Flow container (replaces GraphPlaceholder)

hooks/
└── useGraphData.ts          # Transform canvas data to React Flow format
```

### Files to Modify
```
components/investigations/
└── CanvasPanel.tsx          # Replace GraphPlaceholder with GraphTab
```

### Files to Delete
```
components/canvas/
└── GraphPlaceholder.tsx     # Remove placeholder (replaced by GraphTab)
```

---

## 14. Dependencies & Imports

### New npm packages required
```json
{
  "dependencies": {
    "reactflow": "^11.11.0",
    "dagre": "^0.8.5"
  },
  "devDependencies": {
    "@types/dagre": "^0.7.52"
  }
}
```

### Key Imports
```typescript
import ReactFlow, {
    ReactFlowProvider,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    type Node,
    type Edge,
    type NodeTypes,
    type EdgeTypes,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
```

---

## 15. Notes & Considerations

### Edge Cases to Handle
1. **No data yet:** Show message "No connections yet — evidence links will appear as fact-checking completes." + show any isolated nodes that exist
2. **No fact_checks (but have sources/claims):** Show sources and claims as isolated/unconnected nodes (visual progress indicator)
3. **Many nodes (30+):** Ensure smooth performance, may need to limit display or paginate
4. **Single source/claim:** Display single node in center
5. **Layout collision:** Dagre should handle, but verify with many nodes

### MVP Simplifications
- **Node position persistence:** Session-only (not saved to database)
- **Export functionality:** Placeholder button only (Phase 7+)
- **Add Node button:** Placeholder (requires HITL workflow)
- **Source type badges:** Skipped for MVP (no database field; post-hackathon feature)

### Color Reference
| Element | Color | Hex |
|---------|-------|-----|
| Verified Claim | Green | #22c55e |
| Unverified Claim | Yellow | #eab308 |
| Contradicted Claim | Red | #ef4444 |
| Supporting Edge | Green | #22c55e |
| Contradicting Edge | Red | #ef4444 |
| OFFICIAL Badge | Blue | #3b82f6 |
| HUMINT Badge | Purple | #a855f7 |
| DATA Badge | Cyan | #06b6d4 |
| NEWS Badge | Gray | #6b7280 |

---

## 16. Ready to Implement

Once approved, implementation will:
1. Install React Flow and Dagre dependencies
2. Create 1 new hook file (`useGraphData.ts`)
3. Create 8 new component files (graph/, GraphTab.tsx)
4. Modify 1 existing component (`CanvasPanel.tsx`)
5. Delete 1 file (`GraphPlaceholder.tsx`)
6. Implement all interactive features (drag, hover, click, zoom)

**Estimated time:** 4-5 hours of implementation + testing

---

## 17. Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| React Flow version | v11 | Latest stable, well-documented |
| Layout library | Dagre | Specified in roadmap, good for hierarchical layouts |
| Node position storage | Session only | MVP simplicity, avoid database complexity |
| Detail panels | Slide-out panel on right | Simple (~20 lines), keeps graph visible, better UX than modal |
| Source type badges | Skip for MVP | No database field, would require migration + agent changes |
| Empty state | Show isolated nodes + message | Lets users see visual progress as connections form |
| Hover effects | Simple shadow/glow | Fast to implement (~5 lines), clean UX |
| Zoom controls | React Flow built-in `<Controls />` | Standard, fastest to implement |

---

*Template Version: 1.3*
*Created: 2026-02-09*
