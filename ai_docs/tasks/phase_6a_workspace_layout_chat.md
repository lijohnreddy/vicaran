# Phase 6a: Investigation Workspace Layout + Chat Interface

> **Task Type:** Feature Implementation
> **Priority:** High
> **Estimated Complexity:** Medium
> **Created:** 2026-02-07
> **Related Roadmap:** Phase 6 - Investigation Workspace (Part 1 of 3)

---

## 1. Task Overview

### Task Title
**Title:** Build Investigation Workspace with Two-Column Layout and Integrated Chat Interface

### Goal Statement
**Goal:** Create the core two-column investigation workspace that displays real-time agent conversation in the left column (40%) and canvas placeholders in the right column (60%). This establishes the foundation for the full investigation interface, allowing users to view ongoing investigations with live chat updates from the AI agent.

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis
**SKIP STRATEGIC ANALYSIS** - The approach is already defined:
- User confirmed polling-based approach (not SSE)
- Desktop-first (1024px+) confirmed
- Split into sub-phases confirmed
- Existing chat components provide clear patterns to follow

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15, React 19
- **Language:** TypeScript 5.x with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS
- **Authentication:** Supabase Auth via middleware for protected routes
- **Key Patterns:** 
  - App Router with Server Components
  - Server Actions for mutations
  - Polling-based real-time updates (3-second interval)
  - Context-based state management

### Current State

**Investigation Workspace Page (`app/(protected)/investigations/[investigationId]/page.tsx`):**
- Currently shows a basic placeholder with investigation title, brief, and status
- Handles different states: pending, active, completed, failed, partial
- Shows "Phase 6 not implemented" message for completed investigations
- ~100 lines of simple status display

**Existing Chat Infrastructure (from Phase 5):**
- `ChatInterface.tsx` - Wrapper with `ChatStateProviderWithBoundary`
- `ChatContainer.tsx` - Container with message list and input
- `ChatInput.tsx` - Text input with send button
- `MessageList.tsx` - Displays messages with agent/user distinction
- `ChatStateContext.tsx` - Orchestrates polling + message flow
- `useChatPolling.ts` - 3-second polling hook
- `useChatMessages.ts` - Message state management
- `useChatMessageFlow.ts` - Message submission flow

**Database Schema (Ready):**
- `investigations` table with session_id field
- All related tables (sources, claims, fact_checks, timeline_events)

### Existing Context Providers Analysis
- **UserContext (`useUser()`):** User data from authentication, provided in protected layout
- **SidebarProvider:** Sidebar state, provided in protected layout
- **ChatStateContext:** Chat messages, polling, input state - currently used for standalone chat page

**Context Hierarchy:**
```
ProtectedLayout
└── UserProvider (userWithRole.user)
    └── SidebarProvider
        └── AppSidebar + main content
            └── Page components have access to useUser(), useSidebar()
```

---

## 4. Context & Problem Definition

### Problem Statement
The current investigation workspace page shows only basic status information. Users need a full investigation interface with:
1. Real-time chat showing agent progress and messages
2. Canvas area for displaying structured investigation data
3. Ability to send messages to the agent during investigation
4. Browser refresh recovery (reconnect to existing session)

### Success Criteria
- [ ] Two-column layout renders correctly (40% chat / 60% canvas)
- [ ] Canvas is resizable via draggable divider
- [ ] Canvas can be collapsed (close button) and expanded (open button in header)
- [ ] **Initial investigation message visible in chat** (first user message with brief & sources)
- [ ] Chat interface shows historical messages from investigation
- [ ] New agent messages appear via polling (3-second interval)
- [ ] Status/progress messages appear inline in chat (e.g., "🔍 Searching for sources...")
- [ ] User can send messages to agent via chat input (within chat column)
- [ ] Chat input has [+] button for adding sources and arrow (→) send button
- [ ] Browser refresh reconnects to existing session
- [ ] Investigation header shows title and Export PDF placeholder button
- [ ] Canvas area shows 3 placeholder tabs: BRIEF | DASHBOARD | GRAPH
- [ ] Status-based UI (pending/active/completed/failed) works correctly
- [ ] Plan approval buttons render inside chat when `[PLAN_APPROVAL_REQUIRED]` marker detected

---

## 5. Development Mode Context

- **🚨 IMPORTANT: This is a new application in active development**
- **No backwards compatibility concerns** - feel free to make breaking changes
- **Data loss acceptable** - existing data can be wiped/migrated aggressively
- **Priority: Speed and simplicity** over data preservation
- **Desktop-first:** Focus on 1024px+ screens

---

## 6. Technical Requirements

### Functional Requirements

**Layout & Canvas:**
- User can view investigation workspace with two-column layout (40% chat, 60% canvas)
- User can resize canvas via draggable divider (default 40/60 split)
- User can collapse canvas (close button inside canvas)
- User can expand collapsed canvas (open button in header when collapsed)

**Chat Interface:**
- User can see real-time chat updates from AI agent
- User can send messages to agent via chat input (contained within 40% chat column)
- Chat input has [+] button to add source URLs
- Chat input has arrow (→) icon for send button
- Status/progress messages appear inline in chat (from agent streaming)
- Messages display fully expanded (no collapsible sections)

**Header & Actions:**
- User can see investigation title in header
- User can click Export PDF button (placeholder, no functionality)

**Canvas Area:**
- User can see 3 canvas tabs: BRIEF | DASHBOARD | GRAPH (all placeholders in Phase 6a)

**Session & Recovery:**
- System reconnects to existing session on browser refresh
- Plan approval buttons render inside chat when `[PLAN_APPROVAL_REQUIRED]` marker detected

**Nice to Have:**
- "Agent is on a coffee break" banner for agent idle/error states

### Non-Functional Requirements
- **Performance:** Chat polling at 3-second intervals
- **Responsive:** Desktop-first (1024px+), canvas hidden on smaller screens
- **Theme Support:** Light and dark mode support
- **Accessibility:** Keyboard navigation, proper ARIA labels

### Technical Constraints
- Must reuse existing polling infrastructure (`useChatPolling`, etc.)
- Must use existing `ChatStateContext` patterns
- Must fetch session from `session_id` in investigation record
- Canvas data fetching deferred to Phase 6b

---

## 7. Data & Database Changes

### Database Schema Changes
**No database changes required.** Existing schema supports all Phase 6a features:
- `investigations.session_id` - Already exists for ADK session tracking
- `investigations.status` - Already exists for status-based UI

### Data Model Updates
**No schema updates needed.**

---

## 8. API & Backend Changes

### ⚠️ Gap Identified: First Message Not Being Sent

**Current Issue:** The `createInvestigationAction` creates an ADK session with initial state (mode, brief, sources), but does NOT send a first message to trigger the agent. The user lands on an empty workspace.

**Fix Required:** After creating the investigation, build and send the first message to `/api/run`.

#### First Message Format
```
Investigation ID: <uuid>
Title: <investigation title>
Mode: <quick|detailed>

**Investigation Brief:**
<user's investigation description>

**User-Provided Sources:**
- <source URL 1>
- <source URL 2>
```

### Modifications Required

#### `app/actions/investigations.ts` → Modify `createInvestigationAction`
**Add after Step 3 (save sources):**
```typescript
// 4. Build and send first message to trigger agent
const firstMessage = buildInvestigationPrompt({
    investigationId: investigation.id,
    title,
    mode,
    brief,
    sources,
});

// Fire-and-forget: trigger the agent
await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        userId: user.id,
        sessionId: adkSession.id,
        message: firstMessage,
    }),
});
```

#### `lib/utils/investigation-prompt.ts` → NEW FILE
**Create helper function:**
```typescript
export function buildInvestigationPrompt(params: {
    investigationId: string;
    title: string;
    mode: "quick" | "detailed";
    brief: string;
    sources: string[];
}): string {
    const sourcesSection = params.sources.length > 0
        ? `\n\n**User-Provided Sources:**\n${params.sources.map(s => `- ${s}`).join("\n")}`
        : "";

    return `Investigation ID: ${params.investigationId}\nTitle: ${params.title}\nMode: ${params.mode}\n\n**Investigation Brief:**\n${params.brief}${sourcesSection}`;
}
```

### Data Access Pattern

#### MUTATIONS (Server Actions) → `app/actions/investigations.ts`
- **Modify:** `createInvestigationAction()` - Add first message trigger after investigation creation
- **Existing:** `deleteInvestigationAction()` - No changes

#### QUERIES (Data Fetching)
- **Complex Query:** `lib/queries/investigations.ts` → `getInvestigation(id, userId)` (already exists)
- **Session Fetching:** `lib/adk/session-service.ts` → `AdkSessionService.getSessionWithEvents()` (already exists)

### Server Actions
**Existing actions to reuse:**
- [ ] `getSessionEvents(userId, sessionId)` in `app/actions/sessions.ts` - For polling
- [ ] `sendChatMessage()` pattern from existing chat flow

### API Routes
**Existing routes to reuse:**
- [ ] `POST /api/run` - Fire-and-forget trigger for ADK agent (already exists)
- No new API routes needed

---

## 9. Frontend Changes

### New Components

#### `components/investigations/WorkspaceLayout.tsx`
**Purpose:** Two-column layout wrapper with resizable divider
```typescript
interface WorkspaceLayoutProps {
  investigationId: string;
  investigation: Investigation;
  session: AdkSession | null;
  children?: React.ReactNode; // Canvas content
}
```
- Left column: 40% width for chat (resizable)
- Right column: 60% width for canvas (resizable)
- Draggable divider between columns
- Canvas collapse/expand state management
- Responsive: Hide canvas on mobile or stack vertically

#### `components/investigations/WorkspaceHeader.tsx`
**Purpose:** Header bar with investigation title, status, and actions
```typescript
interface WorkspaceHeaderProps {
  title: string;
  status: InvestigationStatus;
  isCanvasCollapsed: boolean;
  onToggleCanvas: () => void;
}
```
- Shows investigation title
- Shows status badge (reuse `StatusBadge.tsx`)
- Export PDF button (placeholder)
- Canvas expand button (visible when canvas is collapsed)

#### `components/investigations/InvestigationChat.tsx`
**Purpose:** Investigation-specific chat wrapper that provides context
```typescript
interface InvestigationChatProps {
  investigation: Investigation;
  session: AdkSession | null;
}
```
- **Displays investigation title at top of chat column**
- Wraps existing `ChatStateProvider` with investigation context
- Handles status-based rendering (show chat or loading state)
- Renders plan approval buttons when marker detected
- Contains chat input within this component (40% column)

#### `components/investigations/CanvasPanel.tsx`
**Purpose:** Canvas area with tabs and collapse functionality
```typescript
interface CanvasPanelProps {
  isCollapsed: boolean;
  onClose: () => void;
}
```
- Tab buttons: BRIEF | DASHBOARD | GRAPH (3 tabs side by side)
- Close button (×) in top-right corner
- Shows "Coming in Phase 6b" placeholder content

#### `components/chat/ChatInputWithSources.tsx`
**Purpose:** Enhanced chat input with [+] add source button
```typescript
interface ChatInputWithSourcesProps {
  onSendMessage: (message: string) => void;
  onAddSource: (url: string) => void;
  disabled?: boolean;
}
```
- [+] button opens "Add Source" popup/dropdown
- Arrow (→) icon for send button
- Text input field
- Add Source popup: URL input field only (MVP scope)

#### `components/chat/AddSourcePopup.tsx`
**Purpose:** Popup for adding source URLs
```typescript
interface AddSourcePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (url: string) => void;
}
```
- URL input field with validation
- "Add Source" and "Cancel" buttons
- Basic URL validation

#### `components/chat/PlanApprovalButtons.tsx`
**Purpose:** Approve/Edit Plan buttons for HITL workflow
```typescript
interface PlanApprovalButtonsProps {
  onApprove: () => void;
  onEdit: () => void;
}
```
- Two buttons: "✓ Approve Plan" (primary) and "✏️ Edit Plan" (secondary)
- Rendered when message contains `[PLAN_APPROVAL_REQUIRED]` marker

#### `components/investigations/AgentIdleBanner.tsx` (Nice to Have)
**Purpose:** Banner for agent idle/error states
```typescript
interface AgentIdleBannerProps {
  status: "idle" | "error" | "rate_limited";
  onResume?: () => void;
  onNewTask?: () => void;
}
```
- "Agent is on a coffee break" style messaging
- Resume Task / New Task buttons

### Page Updates

#### `app/(protected)/investigations/[investigationId]/page.tsx`
**Complete rewrite to use new components:**
- Fetch investigation data (existing)
- Fetch session with events from ADK (new)
- Render `WorkspaceLayout` with `InvestigationChat` and `CanvasPanel`
- Handle status-based recovery on page load

### State Management
- **InvestigationChat** uses `ChatStateProvider` internally
- **Polling** reuses `useChatPolling` hook
- **Messages** reuses `useChatMessages` hook
- **Canvas collapse state** managed in `WorkspaceLayout` with local state
- **No new context providers needed** - reuse existing patterns

---

## 10. Code Changes Overview

### 📂 **Current Implementation (Before)**
```typescript
// app/(protected)/investigations/[investigationId]/page.tsx
// ~100 lines of basic status display
export default async function InvestigationPage({ params }) {
  const investigation = await getInvestigation(investigationId, userId);
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1>{investigation.title}</h1>
      <StatusBadge status={investigation.status} />
      
      {investigation.status === "completed" && (
        <div>Phase 6 not implemented</div>
      )}
    </div>
  );
}
```

### 📂 **After Refactor**
```typescript
// app/(protected)/investigations/[investigationId]/page.tsx
export default async function InvestigationPage({ params }) {
  const investigation = await getInvestigation(investigationId, userId);
  const session = await AdkSessionService.getSessionWithEvents(
    userId, 
    investigation.session_id
  );
  
  return (
    <WorkspaceLayout 
      investigationId={investigationId}
      investigation={investigation}
      session={session}
    >
      <CanvasPanel />
    </WorkspaceLayout>
  );
}

// WorkspaceLayout renders:
// - WorkspaceHeader (title, export button, canvas expand button when collapsed)
// - Left column (40%): InvestigationChat (with ChatInputWithSources)
// - Draggable divider
// - Right column (60%): {children} (CanvasPanel with tabs)
```

### 🎯 **Key Changes Summary**
- [ ] **Complete page rewrite:** Replace basic status display with full workspace
- [ ] **7 new components:** WorkspaceLayout, WorkspaceHeader, InvestigationChat, CanvasPanel, ChatInputWithSources, AddSourcePopup, PlanApprovalButtons
- [ ] **1 optional component:** AgentIdleBanner (nice to have)
- [ ] **Session integration:** Fetch ADK session on page load for chat history
- [ ] **Reuse chat infrastructure:** All polling/messaging from existing hooks
- [ ] **Files Modified:** `investigations/[investigationId]/page.tsx`
- [ ] **Files Created:** 7-8 new component files

---

## 11. Implementation Plan

### Phase 0: Fix First Message Trigger (Critical)
**Goal:** Ensure the agent is triggered when investigation is created

- [ ] **Task 0.1:** Create `lib/utils/investigation-prompt.ts`
  - Files: `lib/utils/investigation-prompt.ts`
  - Details: Helper function `buildInvestigationPrompt()` to format first message with ID, mode, brief, sources

- [ ] **Task 0.2:** Modify `createInvestigationAction` to send first message
  - Files: `app/actions/investigations.ts`
  - Details: After saving investigation, call `/api/run` with formatted first message to trigger agent

### Phase 1: Create Base Layout Components
**Goal:** Build the structural components for the workspace


- [ ] **Task 1.1:** Create `WorkspaceLayout.tsx`
  - Files: `components/investigations/WorkspaceLayout.tsx`
  - Details: Two-column flex layout with 40/60 split, draggable divider, responsive handling

- [ ] **Task 1.2:** Create `WorkspaceHeader.tsx`
  - Files: `components/investigations/WorkspaceHeader.tsx`
  - Details: Title, status badge, Export PDF placeholder, canvas expand button

- [ ] **Task 1.3:** Create `CanvasPanel.tsx`
  - Files: `components/investigations/CanvasPanel.tsx`
  - Details: 3 tabs (BRIEF | DASHBOARD | GRAPH), close button, placeholder content

### Phase 2: Create Chat Integration Components
**Goal:** Wire up chat functionality with investigation context

- [ ] **Task 2.1:** Create `InvestigationChat.tsx`
  - Files: `components/investigations/InvestigationChat.tsx`
  - Details: Wraps `ChatStateProviderWithBoundary`, handles session prop

- [ ] **Task 2.2:** Create `ChatInputWithSources.tsx`
  - Files: `components/chat/ChatInputWithSources.tsx`
  - Details: [+] button for sources, arrow send button, text input

- [ ] **Task 2.3:** Create `AddSourcePopup.tsx`
  - Files: `components/chat/AddSourcePopup.tsx`
  - Details: URL input popup, validation, add/cancel buttons

- [ ] **Task 2.4:** Create `PlanApprovalButtons.tsx`
  - Files: `components/chat/PlanApprovalButtons.tsx`
  - Details: Approve/Edit buttons, onClick handlers for plan workflow

- [ ] **Task 2.5:** Update `MessageList.tsx` (if needed)
  - Files: `components/chat/MessageList.tsx`
  - Details: Detect `[PLAN_APPROVAL_REQUIRED]` marker, render approval buttons

### Phase 3: Rewrite Investigation Page
**Goal:** Complete the page with all integrated components

- [ ] **Task 3.1:** Update investigation page to fetch session
  - Files: `app/(protected)/investigations/[investigationId]/page.tsx`
  - Details: Add `AdkSessionService.getSessionWithEvents()` call

- [ ] **Task 3.2:** Integrate all components in page
  - Files: `app/(protected)/investigations/[investigationId]/page.tsx`
  - Details: Render WorkspaceLayout → InvestigationChat + CanvasPanel

- [ ] **Task 3.3:** Handle status-based recovery
  - Files: `app/(protected)/investigations/[investigationId]/page.tsx`
  - Details: On load - check status, show appropriate UI, start polling if active

### Phase 4: Basic Code Validation (AI-Only)
**Goal:** Run safe static analysis only

- [ ] **Task 4.1:** TypeScript compilation check
  - Command: `npx tsc --noEmit` (in apps/web)
  - Details: Verify no type errors in new components

- [ ] **Task 4.2:** ESLint validation
  - Command: `npm run lint` (in apps/web)
  - Details: Check for linting issues

- [ ] **Task 4.3:** File content verification
  - Details: Read all new files to verify structure and imports

### Phase 5: User Browser Testing
**Goal:** Manual verification in browser

- [ ] **Task 5.1:** Navigate to existing investigation
  - Test: Open `/investigations/[id]` for an existing investigation
  - Expected: Two-column layout displays correctly (40% chat, 60% canvas)

- [ ] **Task 5.2:** Test canvas resize
  - Test: Drag the divider to resize columns
  - Expected: Columns resize smoothly, layout stays usable

- [ ] **Task 5.3:** Test canvas collapse/expand
  - Test: Click close button in canvas, then expand button in header
  - Expected: Canvas collapses (chat goes full width), expands back

- [ ] **Task 5.4:** Verify chat displays history
  - Test: Check that historical messages from session appear
  - Expected: Messages show with agent/user distinction

- [ ] **Task 5.5:** Verify polling works
  - Test: Leave page open, observe new messages appearing
  - Expected: Messages update every 3 seconds when agent is active

- [ ] **Task 5.6:** Test message sending
  - Test: Type and send a message via chat input
  - Expected: Message appears in chat, triggers agent

- [ ] **Task 5.7:** Test [+] add source button
  - Test: Click [+], enter URL, add source
  - Expected: Popup opens, URL can be entered, source added

- [ ] **Task 5.8:** Verify browser refresh recovery
  - Test: Refresh page during active investigation
  - Expected: Chat reconnects and shows message history

- [ ] **Task 5.9:** Verify canvas tabs
  - Test: Check that 3 tabs are visible: BRIEF | DASHBOARD | GRAPH
  - Expected: Tabs visible (all show placeholder content)

---

## 12. Verification Plan

### Automated Tests
**No existing tests found for investigation workspace.**

New manual verification:
1. TypeScript compilation: `npx tsc --noEmit`
2. ESLint: `npm run lint`
3. Build check: `npm run build` (to verify no runtime errors)

### Manual Verification (User Required)

**Test 1: Basic Layout Rendering**
1. Start the dev server: `npm run dev` (in apps/web)
2. Login to the application
3. Navigate to an existing investigation at `/investigations/[investigationId]`
4. Verify: Two-column layout (40% chat left, 60% canvas right) displays
5. Verify: Header shows investigation title

**Test 2: Canvas Resize & Toggle**
1. Drag the divider between chat and canvas
2. Verify: Both columns resize proportionally
3. Click the close (×) button in the canvas
4. Verify: Canvas collapses, chat expands to full width
5. Click the expand button in the header
6. Verify: Canvas re-opens to previous size

**Test 3: Chat Message Display**
1. Ensure you have an investigation with existing chat history
2. Navigate to that investigation
3. Verify: Historical messages display in the chat area
4. Verify: Agent messages have 🤖 icon, user messages have 👤 icon
5. Verify: Progress messages like "🔍 Searching..." appear inline

**Test 4: Chat Input Features**
1. Verify: Input field is contained within the 40% chat column
2. Click the [+] button
3. Verify: Add Source popup appears
4. Enter a URL and click Add
5. Verify: Source is added (or shown in pending state)
6. Type a message in the input
7. Click the arrow (→) send button
8. Verify: Message is sent

**Test 5: Canvas Tabs**
1. Verify: 3 tabs visible: BRIEF | DASHBOARD | GRAPH
2. Click each tab
3. Verify: All show placeholder "Coming in Phase 6b" content

**Test 6: Browser Refresh**
1. Open an investigation workspace
2. Press F5 or refresh the page
3. Verify: Chat history is preserved
4. Verify: Polling resumes automatically

---

## 13. File Structure Summary

### New Files to Create
```
components/investigations/
├── WorkspaceLayout.tsx      # Two-column layout with resizable divider
├── WorkspaceHeader.tsx      # Title, status, actions, canvas expand button
├── InvestigationChat.tsx    # Chat with investigation context
└── CanvasPanel.tsx          # Canvas with tabs and close button

components/chat/
├── ChatInputWithSources.tsx # Enhanced input with [+] and arrow send
├── AddSourcePopup.tsx       # URL input popup for adding sources
└── PlanApprovalButtons.tsx  # Approve/Edit plan buttons

(Optional - Nice to Have)
components/investigations/
└── AgentIdleBanner.tsx      # "Coffee break" banner
```

### Files to Modify
```
app/(protected)/investigations/[investigationId]/
└── page.tsx                 # Complete rewrite with new components

components/chat/
└── MessageList.tsx          # Detect plan approval markers (if needed)
```

---

## 14. Dependencies & Imports

### No new npm packages required
All functionality uses existing packages:
- Next.js App Router
- React
- Tailwind CSS
- shadcn/ui components
- Existing ADK session service

### Key Imports for New Components
```typescript
// From existing codebase
import { ChatStateProviderWithBoundary } from "@/contexts/ChatStateContext";
import { AdkSessionService } from "@/lib/adk/session-service";
import { getInvestigation } from "@/lib/queries/investigations";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
```

---

## 15. Initial Investigation Message Format

When a user creates an investigation from `/investigations/new`, the first message sent to the agent contains:

```
Investigation ID: <uuid>
Title: <investigation title>
Mode: <quick|detailed>

**Investigation Brief:**
<user's investigation description>

**User-Provided Sources:**
- <source URL 1>
- <source URL 2>
- ...
```

**This first message MUST be visible in the chat** when the user opens the workspace. It shows:
- The investigation title
- What the user asked to investigate (the brief)
- Which sources they provided
- Which mode was selected

**Implementation Note:** This message is already stored in the ADK session events. When fetching session history via `AdkSessionService.getSessionWithEvents()`, the first event should contain this user prompt which should be rendered as the first message in the chat.

---

## 16. Agent Message Streaming Reference

Based on the workflow design, status/progress messages appear inline in chat:

| Stage | Example Messages |
|-------|------------------|
| Plan | "📋 Investigation Plan..." → `[PLAN_APPROVAL_REQUIRED]` |
| Start | `[INVESTIGATION_STARTED]` → "Starting investigation pipeline..." |
| Sources | "🔍 Searching for sources..." → "✅ Found 18 sources" |
| Claims | "📝 Extracting claims from 21 sources..." |
| Fact Check | "🔎 Verifying claim 1/5..." → "✅ VERIFIED" / "⚠️ PARTIALLY TRUE" |
| Bias | "⚖️ Analyzing bias across sources..." |
| Timeline | "📅 Building timeline..." or `[TIMELINE_SKIPPED]` |
| Summary | "📊 Generating final summary..." → `[INVESTIGATION_COMPLETE]` |

Frontend markers to detect:
- `[PLAN_APPROVAL_REQUIRED]` → Show approve/edit buttons
- `[INVESTIGATION_STARTED]` → Show progress, optionally disable input
- `[INVESTIGATION_COMPLETE]` → Re-enable chat, show final results

---

## 17. Notes & Considerations

### What's Deferred to Phase 6b
- Canvas tab content (Brief, Dashboard sub-tabs)
- Source/Claims/FactChecks/Bias/Timeline data display
- Database polling for canvas data

### What's Deferred to Phase 6c
- Graph tab with React Flow
- Interactive visualization
- Node/edge rendering

### Edge Cases to Handle
1. **No session found:** Show error state or redirect
2. **Investigation not found:** Show 404 (existing behavior)
3. **Agent not responding:** Chat shows waiting indicator
4. **Polling errors:** Silent retry (existing behavior in useChatPolling)
5. **Canvas collapsed on page load:** Restore to default 40/60 split
6. **No initial message:** Handle gracefully if session has no events yet

---

## 18. Ready to Implement

Once approved, implementation will:
1. Create 7-8 new component files
2. Rewrite the investigation page
3. Integrate with existing chat infrastructure
4. Add resizable canvas with tabs
5. Add [+] source button and arrow send button
6. Handle browser refresh recovery
7. Display initial investigation message in chat

**Estimated time:** 3-4 hours of implementation + testing
