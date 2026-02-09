# Phase 5: Home Page & Investigation Setup

> **Task Template v1.3**

---

## 1. Task Overview

### Task Title
**Title:** Phase 5 - Home Page & Investigation Setup

### Goal Statement
**Goal:** Build the home dashboard with recent investigations and the investigation setup form that allows users to start new investigations. This includes creating a placeholder workspace page, implementing ADK session creation, and updating the sidebar navigation.

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis
**❌ SKIP STRATEGIC ANALYSIS** - The implementation approach is clearly defined in the roadmap and user has already provided specific directions:
- Create placeholder workspace page (Phase 6 will replace)
- Use `AdkSessionService.createSession()` for session ID generation
- Save initial sources to DB AND pass to agent
- Create reusable `StatusBadge` component
- Add History button to sidebar (not full list)

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS
- **Authentication:** Supabase Auth managed by `middleware.ts`
- **Key Architectural Patterns:** Next.js App Router, Server Components, Server Actions
- **Relevant Existing Components:** 
  - `components/layout/AppSidebar.tsx` - sidebar navigation
  - `components/ui/sidebar.tsx` - shadcn sidebar primitives
  - `lib/adk/session-service.ts` - ADK session management

### Current State
- **Home page (`/home`)**: Currently just redirects to `/chat`
- **Investigation setup**: No page exists at `/investigations/new`
- **Investigation workspace**: No page exists at `/investigations/[id]`
- **Sidebar**: Has Chat, History, Profile navigation - needs "New Investigation" CTA
- **`createInvestigationAction`**: Currently expects `session_id` from form - needs to call ADK

### Existing Context Providers Analysis
- **UserContext (`useUser()`):** Provides `id`, `role`, user info. Available in protected layout.
- **SidebarProvider (`useSidebar()`):** Provides `open`, `isMobile`, `toggleSidebar`. Available in protected layout.
- **Context Hierarchy:** `UserProvider` → `SidebarProvider` → App content

---

## 4. Context & Problem Definition

### Problem Statement
Users currently have no clear entry point to start investigations. The home page just redirects to chat, there's no form to configure investigations, and no way to see recent investigations at a glance.

### Success Criteria
- [ ] Home page shows welcome message, "New Investigation" CTA, and recent investigations list
- [ ] Investigation setup form collects title, brief, sources (optional), and mode
- [ ] Form submission creates ADK session, saves to DB, and redirects to workspace
- [ ] Placeholder workspace page shows investigation status
- [ ] `StatusBadge` component displays human-readable statuses with colors
- [ ] Sidebar has "New Investigation" button and History link

---

## 5. Development Mode Context

- **🚨 IMPORTANT: This is a new application in active development**
- **No backwards compatibility concerns** - feel free to make breaking changes
- **Priority: Speed and simplicity** over data preservation

---

## 6. Technical Requirements

### Functional Requirements
- User can view a welcome dashboard at `/home` with their name
- User can click "New Investigation" to navigate to setup form
- User can fill out investigation title (required), brief (required), sources (optional), mode (required)
- User can add/remove multiple source URLs
- System creates ADK session and investigation record on form submission
- User is redirected to `/investigations/[id]` after submission
- Recent investigations (up to 5) are displayed on home page with status badges

### Non-Functional Requirements
- **Performance:** Home page loads in < 1s
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), desktop (1024px+)
- **Theme Support:** Must support both light and dark mode
- **Accessibility:** Proper form labels, ARIA attributes, keyboard navigation

### Design Decisions (Confirmed)

#### Source Input: Inline List Pattern
**Decision:** Use a dynamic inline list for adding sources, similar to a tag input.
```
[ Input Field for URL     ] [+ Add]

• https://reuters.com/article...  [×]
• https://nytimes.com/2024/...    [×]
```
- **Rationale:** Fewer clicks, visual feedback as sources stack up, matches wireframe pattern
- **Validation:** Format-only URL validation using regex/Zod (no reachability check)
- **Why no reachability check:** CORS blocks browser-side URL pinging; agent's `source_finder` handles unreachable URLs gracefully

#### Form Submission Flow (Option B)
**Decision:** Create ADK session on form submit, save to DB, then redirect.
```
User clicks "Start Investigation"
        │
        ▼
┌───────────────────────────────────────┐
│ 1. Create ADK Session (get session_id)│
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│ 2. Create Investigation Record        │
│    (status: "pending")                │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│ 3. Redirect to /investigations/[id]   │
└───────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│ 4. Agent starts via SSE, sends        │
│    INVESTIGATION_STARTED callback     │
│    (updates status to "active")       │
└───────────────────────────────────────┘
```
- **Rationale:** Matches ADK walkthrough reference pattern, session_id required before DB record, immediate redirect for snappy UX

#### Error Handling: ADK Session vs Form Data
**Key Clarification:** ADK session state is server-persisted. Form data (title, brief, sources) is client-only React state.
- If user refreshes before clicking "Start Investigation": Form data lost, but this is acceptable for MVP
- If ADK session creation fails: Show error toast on setup page, keep form data intact for retry
- If ADK service unreachable: No retry on form submit (would be confusing UX), show immediate error

---

## 7. Data & Database Changes

### Database Schema Changes
**No schema changes required** - investigations table already exists from Phase 3.

### Data Model Updates
**No changes needed** - using existing `Investigation` type from `lib/drizzle/schema/investigations.ts`.

---

## 8. API & Backend Changes

### Server Actions
- [ ] **`createInvestigationAction`** - MODIFY: Use `AdkSessionService.createSession()` instead of expecting `session_id` from form. Save initial sources to DB and pass to agent.

### Database Queries
- [ ] **`getRecentInvestigations(userId, limit)`** - NEW: Add to `lib/queries/investigations.ts`
- [ ] **`saveInitialSources(investigationId, urls)`** - NEW: Add to `lib/queries/sources.ts`

### API Routes
**No new API routes needed** - using Server Actions pattern.

---

## 9. Frontend Changes

### New Components

#### `components/home/RecentInvestigations.tsx`
Server component to fetch and display recent investigations.

#### `components/investigations/InvestigationForm.tsx`
Client component with investigation setup form.

#### `components/investigations/SourceInput.tsx`
Client component for adding/removing source URLs.

#### `components/investigations/ModeSelector.tsx`
Client component for Quick vs Detailed mode selection.

#### `components/ui/StatusBadge.tsx`
Reusable component with typed `STATUS_CONFIG` for status display.

### Page Updates
- [ ] **`/home`** - Replace redirect with full dashboard
- [ ] **`/investigations/new`** - NEW: Investigation setup form
- [ ] **`/investigations/[investigationId]`** - NEW: Placeholder workspace

### State Management
- Form state managed locally in `InvestigationForm.tsx`
- User data available via `useUser()` context

---

## 10. Code Changes Overview

### 📂 **Current Implementation (Before)**

```typescript
// app/(protected)/home/page.tsx
import { redirect } from "next/navigation";

export default function HomePage() {
    redirect("/chat");
}
```

```typescript
// app/actions/investigations.ts (lines 22-31)
const sessionId = formData.get("session_id") as string; // From ADK

if (!title || !brief || !mode || !sessionId) {
    throw new Error("Missing required fields: title, brief, mode, or session_id");
}
```

```typescript
// components/layout/AppSidebar.tsx (lines 46-53)
const navItems = [
    { href: "/chat", label: "Chat", icon: MessageCirclePlus },
    { href: "/history", label: "History", icon: Clock },
    { href: "/profile", label: "Profile", icon: User },
    // ... admin
];
```

### 📂 **After Refactor**

```typescript
// app/(protected)/home/page.tsx
import { getCurrentUserWithRole, requireUserId } from "@/lib/auth";
import { getRecentInvestigations } from "@/lib/queries/investigations";
import { RecentInvestigations } from "@/components/home/RecentInvestigations";
import Link from "next/link";

export default async function HomePage() {
    const user = await getCurrentUserWithRole();
    const recent = await getRecentInvestigations(user.user.id, 5);
    
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1>Welcome back, {user.user.email?.split('@')[0]}!</h1>
            <Link href="/investigations/new">
                <Button size="lg">+ Start New Investigation</Button>
            </Link>
            <RecentInvestigations investigations={recent} />
        </div>
    );
}
```

```typescript
// app/actions/investigations.ts - Uses AdkSessionService
import { AdkSessionService } from "@/lib/adk/session-service";

export async function createInvestigationAction(formData: FormData) {
    const userId = user.id;
    
    // Create ADK session (ADK generates the ID)
    const adkSession = await AdkSessionService.createSession(userId, {
        user_id: userId,
        investigation_mode: mode,
        investigation_brief: brief,
    });
    
    // Create investigation with ADK session ID
    const investigation = await createInvestigation({
        user_id: userId,
        session_id: adkSession.id,
        // ...
    });
}
```

```typescript
// components/layout/AppSidebar.tsx - New Investigation CTA + Home
const navItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/investigations/new", label: "New Investigation", icon: Plus, primary: true },
    { href: "/history", label: "History", icon: Clock },
    { href: "/profile", label: "Profile", icon: User },
];
```

### 🎯 **Key Changes Summary**
- **Home page**: Full dashboard instead of redirect
- **Session ID**: ADK generates it via `AdkSessionService.createSession()`
- **Sidebar**: Add Home, New Investigation CTA
- **New pages**: `/investigations/new`, `/investigations/[id]`
- **New components**: `RecentInvestigations`, `InvestigationForm`, `SourceInput`, `ModeSelector`, `StatusBadge`

---

## 11. Implementation Plan

### Phase 1: StatusBadge Component
**Goal:** Create reusable status display component

- [ ] **Task 1.1:** Create `components/ui/StatusBadge.tsx`
  - Files: `components/ui/StatusBadge.tsx`
  - Details: Typed `STATUS_CONFIG` with colors plus `StatusBadge` component

### Phase 2: Database Query Updates
**Goal:** Add query functions for home page and initial sources

- [ ] **Task 2.1:** Add `getRecentInvestigations()` to investigations.ts
  - Files: `lib/queries/investigations.ts`
  - Details: New function with limit parameter
- [ ] **Task 2.2:** Add `saveInitialSources()` to sources.ts
  - Files: `lib/queries/sources.ts`
  - Details: Bulk insert user-provided URLs

### Phase 3: Home Page Implementation
**Goal:** Build welcome dashboard with recent investigations

- [ ] **Task 3.1:** Create `components/home/RecentInvestigations.tsx`
  - Files: `components/home/RecentInvestigations.tsx`
  - Details: Display list with StatusBadge, link to workspace
- [ ] **Task 3.2:** Update `app/(protected)/home/page.tsx`
  - Files: `app/(protected)/home/page.tsx`
  - Details: Welcome message, New Investigation CTA, recent list
- [ ] **Task 3.3:** Create `app/(protected)/home/loading.tsx`
  - Files: `app/(protected)/home/loading.tsx`
  - Details: Loading skeleton

### Phase 4: Investigation Setup Form
**Goal:** Create investigation configuration form

- [ ] **Task 4.1:** Create `components/investigations/ModeSelector.tsx`
  - Files: `components/investigations/ModeSelector.tsx`
  - Details: Quick vs Detailed with descriptions
- [ ] **Task 4.2:** Create `components/investigations/SourceInput.tsx`
  - Files: `components/investigations/SourceInput.tsx`
  - Details: Add/remove URL inputs with validation
- [ ] **Task 4.3:** Create `components/investigations/InvestigationForm.tsx`
  - Files: `components/investigations/InvestigationForm.tsx`
  - Details: Full form component
- [ ] **Task 4.4:** Create `app/(protected)/investigations/new/page.tsx`
  - Files: `app/(protected)/investigations/new/page.tsx`
  - Details: Page wrapper
- [ ] **Task 4.5:** Create `app/(protected)/investigations/new/loading.tsx`
  - Files: `app/(protected)/investigations/new/loading.tsx`

### Phase 5: Server Action Update
**Goal:** Update createInvestigationAction to use ADK session service

- [ ] **Task 5.1:** Update `app/actions/investigations.ts`
  - Files: `app/actions/investigations.ts`
  - Details: Use `AdkSessionService.createSession()`, save initial sources

### Phase 6: Placeholder Workspace Page
**Goal:** Create minimal workspace placeholder for Phase 6

- [ ] **Task 6.1:** Create `app/(protected)/investigations/[investigationId]/page.tsx`
  - Files: `app/(protected)/investigations/[investigationId]/page.tsx`
  - Details: Fetch investigation, show status, mode, "Starting..." message
- [ ] **Task 6.2:** Create loading and error pages
  - Files: `loading.tsx`, `error.tsx`

### Phase 7: Sidebar Navigation Update
**Goal:** Add Home link and New Investigation CTA to sidebar

- [ ] **Task 7.1:** Update `components/layout/AppSidebar.tsx`
  - Files: `components/layout/AppSidebar.tsx`
  - Details: Add Home icon, make New Investigation prominent

### Phase 8: Basic Code Validation
**Goal:** Static analysis and linting

- [ ] **Task 8.1:** Run `npm run lint` on modified files
- [ ] **Task 8.2:** Verify TypeScript compilation

### Phase 9: Comprehensive Code Review
**Goal:** Present completion and review all changes

- [ ] **Task 9.1:** Present "Implementation Complete!" message
- [ ] **Task 9.2:** Execute code review (if approved)

### Phase 10: User Browser Testing
**Goal:** Request human testing

- [ ] **Task 10.1:** Present testing checklist to user (see Verification Plan)

---

## 11.5 Verification Plan

### Manual Browser Testing (User)
**Instructions:** After implementation is complete, the user should manually verify the following in their browser at `localhost:3000`.

#### Home Page (`/home`)
- [ ] Navigate to `/home` - should show welcome message with user's name
- [ ] Should display "Start New Investigation" button prominently
- [ ] Should show recent investigations list (or empty state if none exist)
- [ ] Click "Start New Investigation" - should navigate to `/investigations/new`
- [ ] Test in both light and dark mode

#### Investigation Setup Form (`/investigations/new`)
- [ ] Form shows title input (required), brief textarea (required), mode selector
- [ ] Mode selector shows Quick Search and Detailed Inquiry options with descriptions
- [ ] Source input: Type a URL and click "+ Add" - should appear below as a removable chip
- [ ] Source input: Add 2-3 sources, verify they display correctly
- [ ] Source input: Click × on a source to remove it
- [ ] Invalid URL: Type "not-a-url" - should show validation error
- [ ] Submit with empty title - should show validation error
- [ ] Submit with empty brief - should show validation error  
- [ ] Fill all required fields, click "Start Investigation"
- [ ] Should redirect to `/investigations/[id]` (placeholder workspace)

#### Placeholder Workspace (`/investigations/[id]`)
- [ ] Page loads and shows investigation title, mode, status
- [ ] Status should show as "pending" or "active" with appropriate badge color
- [ ] Page displays a placeholder message ("Investigation starting..." or similar)

#### Sidebar Navigation
- [ ] Sidebar shows "Home" icon/link
- [ ] Sidebar shows "New Investigation" as prominent CTA
- [ ] Sidebar shows "History" link
- [ ] Click each link - should navigate correctly

### Automated Validation (AI)
- [ ] Run `npm run lint` - all files should pass
- [ ] Run `npm run type-check` - no TypeScript errors
- [ ] Verify no console errors during navigation

---

## 12. Task Completion Tracking

Updates will be added here as tasks are completed.

---

## 13. File Structure & Organization

### New Files to Create
```
apps/web/
├── app/(protected)/
│   ├── home/
│   │   ├── page.tsx           # Full dashboard (replace redirect)
│   │   └── loading.tsx        # Loading skeleton
│   └── investigations/
│       ├── new/
│       │   ├── page.tsx       # Setup form page
│       │   └── loading.tsx
│       └── [investigationId]/
│           ├── page.tsx       # Placeholder workspace
│           ├── loading.tsx
│           └── error.tsx
├── components/
│   ├── home/
│   │   └── RecentInvestigations.tsx
│   ├── investigations/
│   │   ├── InvestigationForm.tsx
│   │   ├── SourceInput.tsx
│   │   └── ModeSelector.tsx
│   └── ui/
│       └── StatusBadge.tsx
└── lib/queries/
    └── sources.ts             # Add saveInitialSources
```

### Files to Modify
- [ ] `app/(protected)/home/page.tsx` - Replace redirect with dashboard
- [ ] `app/actions/investigations.ts` - Use AdkSessionService
- [ ] `lib/queries/investigations.ts` - Add getRecentInvestigations
- [ ] `components/layout/AppSidebar.tsx` - Update navigation

---

## 14. Potential Issues & Security Review

### Error Scenarios to Analyze
- [ ] **ADK session creation fails:** Graceful error handling, don't leave orphan DB records
- [ ] **Invalid source URLs:** Client-side validation before submission

### Edge Cases to Consider
- [ ] **No recent investigations:** Show empty state with CTA
- [ ] **Very long investigation titles:** Truncate in list display

### Security & Access Control Review
- [ ] **User can only see their own investigations:** Already enforced by `user_id` filter

---

## 15. Deployment & Configuration

### Environment Variables
No new environment variables required. Using existing:
- `ADK_URL` - Already configured for agent communication

---

## 16. AI Agent Instructions

See task template for full workflow instructions.

**Key Points:**
- ❌ NEVER run `npm run dev` or `npm run build`
- ✅ Use `npm run lint` for validation
- ✅ Create loading.tsx and error.tsx for new routes

---

## 17. Notes & Additional Context

### Reference Materials
- Wireframe: `ai_docs/prep/wireframe.md` (sections 3, 4)
- Navigation: `ai_docs/prep/page_navigation_routes.md`
- Reference project: `ai_docs/refs/adk-walkthrough-youtube/apps/web/app/actions/adk.ts`

---

## 18. Second-Order Consequences & Impact Analysis

### Impact Assessment

#### Breaking Changes Analysis
- [ ] **Existing API Contracts:** None - adding new functionality
- [ ] **Database Dependencies:** Using existing tables
- [ ] **Component Dependencies:** Sidebar update is additive

#### Ripple Effects Assessment
- [ ] **Data Flow Impact:** New session creation flow, but backward compatible
- [ ] **UI/UX Cascading Effects:** Sidebar change affects all protected routes (improvement)

### Critical Issues Identification
**No red flags identified** - this is primarily additive functionality.

### Mitigation Strategies
- Placeholder workspace page ensures users aren't left on a 404 after form submission
- StatusBadge is reusable for Phase 6+ work

---

*Task created: 2026-02-06*
