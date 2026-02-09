# Phase 6d: Chat UI Redesign - Professional Message Styling

> **Task Type:** UI/UX Improvement
> **Priority:** High
> **Estimated Complexity:** Medium
> **Created:** 2026-02-09
> **Related Roadmap:** Phase 6 - Investigation Workspace (Part 4)

---

## 1. Task Overview

### Task Title
**Title:** Transform Investigation Chat from Generic Boxes to Professional, Clean Message Display

### Goal Statement
**Goal:** Redesign the chat interface to hide backend information (IDs, internal markers), display agent messages in clean professional formats, and create specialized rendering for each agent type - eliminating the "AI-generated" blue box appearance.

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis
**SKIP STRATEGIC ANALYSIS** - The approach is already defined:
- User confirmed neutral colors (no colored borders)
- Only Source Finder should be collapsible
- Vertical timeline style confirmed
- Frontend-only changes (no prompt modifications needed)

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15, React 19
- **Language:** TypeScript 5.x with strict mode
- **UI & Styling:** shadcn/ui components with Tailwind CSS
- **Key Patterns:** App Router with Server Components, polling-based real-time updates

### Current State

**Current Chat Rendering (`components/chat/MessageList.tsx`):**
- Every message wrapped in `Card` component with `bg-primary` (blue)
- Shows raw backend data: `source_id: uuid`, `claim_id: uuid`, etc.
- Internal markers like `[PLAN_APPROVAL_REQUIRED]` visible to users
- All agents rendered with same blue box styling
- No visual hierarchy between different message types

**Agent Message Flow:**
- `MessageList.tsx` → `MessageBubble` → `AgentMessageRenderer.tsx` → `MarkdownRenderer.tsx`
- `AgentMessageRenderer` routes to specialized renderers for `research_evaluator` and `report_composer`
- Other agents fall through to default `MarkdownRenderer`

---

## 4. Context & Problem Definition

### Problem Statement
The current chat UI looks generic and "AI-generated" with:
1. Every message in identical blue boxes
2. Backend technical information visible (UUIDs, internal markers)
3. No visual distinction between agent types
4. Poor information hierarchy - everything has same importance

### Success Criteria
- [ ] Backend IDs (`source_id`, `claim_id`, `fact_check_id`, `event_id`) hidden from display
- [ ] Internal markers (`[PLAN_APPROVAL_REQUIRED]`, `[INVESTIGATION_STARTED]`, etc.) hidden/processed
- [ ] Investigation Plan renders as centered, invitation-style card
- [ ] Source Finder renders as collapsible activity rows with `domain | ⭐⭐⭐⭐ | "Finding..."`
- [ ] Claim Extractor renders as clean card with impact tags (🔴 HIGH, 🟡 MED, 🟢 LOW)
- [ ] Fact Checker renders with verdict pills (✅ VERIFIED, ⚠️ PARTIAL, ❌ FALSE)
- [ ] Bias Analyzer renders with score bars (████░░░░░░ 2/10)
- [ ] Timeline renders as vertical timeline (not table with ID columns)
- [ ] Summary Writer renders as clean markdown (no card wrapper)
- [ ] Neutral colors throughout (no colored borders per agent)

---

## 5. Development Mode Context

- **🚨 IMPORTANT: This is a new application in active development**
- **No backwards compatibility concerns** - feel free to make breaking changes
- **Priority: Speed and simplicity** over complex animations
- **Desktop-first:** Focus on 1024px+ screens

---

## 6. Technical Requirements

### Functional Requirements
- User sees clean, professional chat messages without technical backend data
- User can expand/collapse Source Finder rows to see full details
- User sees Investigation Plan as centered invitation-style card
- User sees Timeline as vertical flow (date → event on a vertical line)
- Agent activity messages display summary info only, hiding IDs

### Non-Functional Requirements
- **Performance:** No impact on existing polling mechanism
- **Theme Support:** Light and dark mode support
- **Accessibility:** Keyboard navigation for expandable rows

### Technical Constraints
- Frontend-only changes (no backend/prompt modifications)
- Must not break existing chat polling or message flow
- Must handle all existing agent types gracefully

---

## 7. Data & Database Changes

### Database Schema Changes
**No database changes required.** This is purely a frontend UI transformation.

---

## 8. API & Backend Changes

### API Changes
**No API changes required.** All transformations happen in the frontend rendering layer.

---

## 9. Frontend Changes

### New Components

#### `lib/chat/content-filter.ts`
**Purpose:** Utility functions to filter and transform message content for display

```typescript
// Functions to create:
filterMarkers(content: string): { clean: string; markers: string[] }
hideBackendIds(content: string): string
parseSourceLine(line: string): { domain: string; stars: number; finding: string } | null
detectAgentOutputType(content: string, agent: string): OutputType
```

---

#### `components/chat/InvestigationPlanCard.tsx`
**Purpose:** Renders investigation plan as centered invitation-style card

**Design:**
```
┌─────────────────────────────────────────────────┐
│            📋 Investigation Plan                │
│                                                 │
│   Investigation Topic: [topic]                  │
│                                                 │
│   What I'll Investigate:                        │
│   • [question 1]                                │
│   • [question 2]                                │
│                                                 │
│   Mode: Detailed | Est. Time: 15-20 min         │
│                                                 │
│   ┌───────────────┐  ┌──────────────┐          │
│   │ ✓ Approve     │  │ ✏️ Edit Plan │          │
│   └───────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────┘
```

**Features:**
- Centered with max-width (600px)
- Glassmorphism background (`bg-white/80 dark:bg-slate-900/80 backdrop-blur`)
- Hide `[PLAN_APPROVAL_REQUIRED]` marker, show buttons instead
- Parse markdown to extract structured sections

---

#### `components/chat/SourceFinderCard.tsx`
**Purpose:** Collapsible activity rows for Source Finder messages

**Collapsed Row Format:**
```
domain.com | ⭐⭐⭐⭐ | "Key finding snippet that gets truncated..."  ›
```

**Expanded Row Format:**
```
domain.com | ⭐⭐⭐⭐                                                  ˅
"The complete key finding text without truncation, showing the full 
quote from the source analysis."
```

**Summary Row (at end):**
```
✅ 7 sources analyzed • 2 high • 2 medium • 3 low • 2 skipped
```

---

#### `components/chat/ClaimExtractorCard.tsx`
**Purpose:** Clean card showing extracted claims with impact tags

**Design:**
```
📝 Claims Extracted

Extracted 24 claims from 8 sources

🔴 HIGH  "The Indian sports industry is transforming..."
🔴 HIGH  "Sports contribute to national progress..."
🟡 MED   "Traditional view of sports is evolving..."
🟢 LOW   "The consumer base is youthful and urban..."
```

---

#### `components/chat/FactCheckerCard.tsx`
**Purpose:** Verdict pills with evidence summaries

**Design:**
```
🔎 Fact Check Results

Verified 24 claims

✅ VERIFIED  "The Indian sports industry is transforming..."
   Evidence: KPMG report confirms structured economic sector.

✅ VERIFIED  "Sports contribute to national progress..."
   Evidence: KPMG report outlines four pillars.

⚠️ PARTIAL   "Market will reach $130B by 2030..."
   Evidence: Projections vary between $100B-$150B.
```

---

#### `components/chat/BiasAnalyzerCard.tsx`
**Purpose:** Bias scores with visual bars

**Design:**
```
⚖️ Bias Analysis

Overall: 2.1/10 (Neutral/Balanced)

Growth of Indian Sports Market     ████░░░░░░ 2/10 Neutral
Transforming Sports Culture        ████░░░░░░ 2/10 Neutral
Sportlight - KPMG                  ██░░░░░░░░ 1/10 Neutral
```

---

#### `components/chat/TimelineCard.tsx`
**Purpose:** Vertical timeline view (not table)

**Design:**
```
📅 Investigation Timeline

2024-01-01 ─●─ Government allocates USD398.4M for sports
               in the 2024-25 fiscal year budget
            │
2024-01-01 ─●─ Indian Sports Market valued at $10 billion
            │
2024-07-15 ─●─ Growth propelled by professional leagues
            │
2024-10-10 ─●─ Draft National Sports Governance Bill 2024
               released for public consultation
```

---

### Component Updates

#### `components/chat/AgentMessageRenderer.tsx`
**Changes:** Route all agent types to specialized components

```typescript
// New routing logic:
switch (agent) {
  case 'investigation_orchestrator':
    if (detectsPlan(content)) return <InvestigationPlanCard ... />;
    break;
  case 'source_finder':
    return <SourceFinderCard ... />;
  case 'claim_extractor':
    return <ClaimExtractorCard ... />;
  case 'fact_checker':
    return <FactCheckerCard ... />;
  case 'bias_analyzer':
    return <BiasAnalyzerCard ... />;
  case 'timeline_builder':
    return <TimelineCard ... />;
  case 'summary_writer':
    return <MarkdownRenderer ... />; // No card wrapper
}
```

---

#### `components/chat/MessageList.tsx`
**Changes:**
- Remove `Card` wrapper for agent messages (keep for user messages)
- Filter out internal marker messages before display
- Pass agent type to `MessageBubble` for routing

---

## 10. Code Changes Overview

### 📂 **Current Implementation (Before)**
```typescript
// MessageList.tsx - MessageBubble component
<Card className="p-3 sm:p-4 bg-primary text-chat-assistant-fg">
  <AgentHeader message={message} />
  <AgentMessageRenderer content={message.content} ... />
  <MessageFooter message={message} />
</Card>
```

### 📂 **After Refactor**
```typescript
// MessageList.tsx - MessageBubble component
{message.type === "user" ? (
  <Card className="p-3 bg-secondary">
    {/* User message - keep card */}
  </Card>
) : (
  <div className="agent-message">
    <AgentMessageRenderer content={message.content} agent={message.agent} />
    <MessageFooter message={message} />
  </div>
)}
```

### 🎯 **Key Changes Summary**
- [ ] **Remove Card wrappers** for agent messages, keep clean flow
- [ ] **Add 6 new components** for specialized agent rendering
- [ ] **Add content filtering** to hide IDs and internal markers
- [ ] **Files Created:** 7 new component/utility files
- [ ] **Files Modified:** `AgentMessageRenderer.tsx`, `MessageList.tsx`

---

## 11. Implementation Plan

### Phase 1: Create Content Filtering Utilities
**Goal:** Build utilities to clean message content

- [ ] **Task 1.1:** Create `lib/chat/content-filter.ts`
  - Files: `lib/chat/content-filter.ts`
  - Details: Functions for `filterMarkers()`, `hideBackendIds()`, `parseSourceLine()`

### Phase 2: Create Agent-Specific Card Components
**Goal:** Build specialized renderers for each agent type

- [ ] **Task 2.1:** Create `InvestigationPlanCard.tsx`
  - Files: `components/chat/InvestigationPlanCard.tsx`
  - Details: Centered invitation-style card with glassmorphism, approval buttons

- [ ] **Task 2.2:** Create `SourceFinderCard.tsx`
  - Files: `components/chat/SourceFinderCard.tsx`
  - Details: Collapsible rows with `domain | stars | finding` format

- [ ] **Task 2.3:** Create `ClaimExtractorCard.tsx`
  - Files: `components/chat/ClaimExtractorCard.tsx`
  - Details: Impact tags (🔴 HIGH, 🟡 MED, 🟢 LOW), no IDs

- [ ] **Task 2.4:** Create `FactCheckerCard.tsx`
  - Files: `components/chat/FactCheckerCard.tsx`
  - Details: Verdict pills (✅/⚠️/❌), evidence summaries

- [ ] **Task 2.5:** Create `BiasAnalyzerCard.tsx`
  - Files: `components/chat/BiasAnalyzerCard.tsx`
  - Details: Score bars (████░░░░░░), overall score

- [ ] **Task 2.6:** Create `TimelineCard.tsx`
  - Files: `components/chat/TimelineCard.tsx`
  - Details: Vertical timeline with dots and connecting lines

### Phase 3: Update Existing Components
**Goal:** Wire up new components and remove blue box styling

- [ ] **Task 3.1:** Update `AgentMessageRenderer.tsx`
  - Files: `components/chat/AgentMessageRenderer.tsx`
  - Details: Add routing logic for all agent types

- [ ] **Task 3.2:** Update `MessageList.tsx`
  - Files: `components/chat/MessageList.tsx`
  - Details: Remove Card wrapper for agent messages, filter internal markers

### Phase 4: Basic Code Validation (AI-Only)
**Goal:** Run static analysis

- [ ] **Task 4.1:** TypeScript compilation check
  - Command: `npx tsc --noEmit` (in apps/web)
- [ ] **Task 4.2:** ESLint validation
  - Command: `npm run lint` (in apps/web)

### Phase 5: User Browser Testing
**Goal:** Manual verification in browser

- [ ] **Task 5.1:** Test Investigation Plan card styling
- [ ] **Task 5.2:** Test Source Finder expand/collapse
- [ ] **Task 5.3:** Test Claims, Fact Check, Bias displays
- [ ] **Task 5.4:** Test Timeline vertical rendering
- [ ] **Task 5.5:** Verify no backend IDs visible anywhere
- [ ] **Task 5.6:** Test light and dark mode

---

## 12. Verification Plan

### Automated Tests
No existing tests for chat UI. Verification via:
- TypeScript compilation: `npx tsc --noEmit`
- ESLint: `npm run lint`
- Build check: `npm run build`

### Manual Verification (User Required)

**Test 1: Investigation Plan Card**
1. Create a new investigation
2. Verify: Plan displays as centered card (not blue box)
3. Verify: `[PLAN_APPROVAL_REQUIRED]` hidden, buttons visible
4. Verify: No investigation ID visible

**Test 2: Source Finder**
1. Run investigation through source finding phase
2. Verify: Sources show as `domain.com | ⭐⭐⭐⭐ | "finding..."`
3. Verify: Click expands to show full finding
4. Verify: No `source_id: uuid` visible

**Test 3: Claims & Fact Checking**
1. Let investigation proceed to claims
2. Verify: Claims show with impact tags (🔴/🟡/🟢)
3. Verify: Fact checks show verdict pills (✅/⚠️/❌)
4. Verify: No `claim_id` or `fact_check_id` visible

**Test 4: Bias & Timeline**
1. Verify: Bias shows score bars, not raw numbers
2. Verify: Timeline shows vertical flow with dots
3. Verify: No `event_id` columns visible

**Test 5: Summary**
1. Wait for investigation to complete
2. Verify: Summary shows as clean markdown (no blue box)
3. Verify: Proper heading hierarchy

---

## 13. File Structure Summary

### New Files to Create
```
lib/chat/
└── content-filter.ts           # Filtering/parsing utilities

components/chat/
├── InvestigationPlanCard.tsx   # Centered invitation-style plan
├── SourceFinderCard.tsx        # Collapsible source rows
├── ClaimExtractorCard.tsx      # Impact-tagged claims
├── FactCheckerCard.tsx         # Verdict pills with evidence
├── BiasAnalyzerCard.tsx        # Score bars
└── TimelineCard.tsx            # Vertical timeline
```

### Files to Modify
```
components/chat/
├── AgentMessageRenderer.tsx    # Add routing for all agents
└── MessageList.tsx             # Remove Card wrapper for agents
```

---

## 14. Design Decisions Summary

| Aspect | Decision |
|--------|----------|
| Colors | **Neutral** - no colored borders per agent |
| Collapsible | **Only Source Finder** - other agents show full content |
| Timeline | **Vertical** - dots and lines, not table |
| Source Format | `domain.com \| ⭐⭐⭐⭐ \| "Finding..."` (no "5/5" numbers) |
| Backend IDs | **Hidden** - filtered out in frontend |
| Internal Markers | **Hidden** - processed but not displayed |
| Summary Style | **Clean markdown** - no card wrapper |
| Plan Style | **Centered invitation card** with glassmorphism |

---

## 15. AI Agent Instructions

### Implementation Approach
1. Create content filtering utilities first (they're used by all cards)
2. Build each card component independently
3. Update AgentMessageRenderer routing
4. Modify MessageList to remove blue boxes
5. Test each agent type visually

### Key Parsing Patterns to Handle

**Source Finder Line:**
```
⭐⭐⭐⭐⭐ 5/5 | deloitte.com 💡 Key finding: "The Indian sports..."
→ Parse to: { domain: "deloitte.com", stars: 5, finding: "The Indian sports..." }
```

**Claim Line:**
```
1. [HIGH IMPACT] "The Indian sports industry is transforming..."
   - Sources: a1e0161a-7fe7-4bc5-9555-3fb0d3d769f2
   - Importance: 1.0
→ Parse to: { impact: "HIGH", text: "The Indian...", importance: 1.0 }
```

**ID Lines to Hide:**
```
🆔 Saved as source_id: bc94410a-f380-489b-b97f-b89628e21o4b
🆔 Saved as claim_id: ebb68770-2923-4c51-b734-64bbff7f1f4b
→ Filter out completely
```

---

## 16. Notes

### Source Finder Expandable Content
**Collapsed:** Shows truncated key finding
**Expanded:** Shows full key finding quote (no other info needed - domain & stars visible in collapsed)

### Prompt Changes
**Not required.** All transformations happen in frontend parsing. The prompts are optimized for the callback system and should not be modified.
