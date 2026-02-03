# AI Task: Phase 3 - Database Schema & Callback API

## 1. Task Overview

### Task Title
**Title:** Phase 3: Database Schema & Callback API Implementation for Vicaran Investigation System

### Goal Statement
**Goal:** Create a complete database schema for storing investigation data (investigations, sources, claims, fact-checks, timeline events) and implement a secure callback API endpoint that allows the Python agent to persist investigation results in real-time as they are discovered. This forms the critical data foundation that enables all investigation features in Vicaran.

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis
✅ **SKIP STRATEGIC ANALYSIS** - This is a straightforward implementation following the existing roadmap specifications. The database schema is already well-defined in Phase 3 of the roadmap, and there's only one obvious technical approach: use Drizzle ORM to create the schema and migrations, then implement a REST API endpoint for agent callbacks.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 16.1.6 with Turbopack, React 19
- **Language:** TypeScript with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS
- **Authentication:** Supabase Auth with Google OAuth managed by middleware.ts
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Relevant Existing Components:** 
  - `lib/drizzle/schema/users.ts` - Existing user schema pattern to follow
  - `lib/drizzle/schema/index.ts` - Central export for all schemas
  - Database migration commands: `npm run db:generate`, `npm run db:migrate`

### Current State
Currently, Vicaran has completed Phase 0 (setup), Phase 1 (landing page), and Phase 2 (authentication). The database contains only `users` and `session-names` tables. There is no schema for investigation data, and there is no API endpoint for agents to communicate with the web app.

**Existing Schema Files:**
- `lib/drizzle/schema/users.ts` - User authentication data
- `lib/drizzle/schema/session-names.ts` - Session name data
- `lib/drizzle/schema/index.ts` - Schema exports

**Migration System:**
- Drizzle ORM handles migrations
- Commands are run from `apps/web/` directory
- Down migrations must be created following `ai_docs/dev_templates/drizzle_down_migration.md`

### Existing Context Providers Analysis
**N/A for this phase** - This phase focuses on database and API infrastructure; no frontend context providers are needed yet. Context providers will be relevant in later phases when building the UI.

---

## 4. Context & Problem Definition

### Problem Statement
Vicaran's AI agents need a place to store investigation results, but currently there are no database tables to hold this data. Additionally, there's no mechanism for the Python agent to communicate investigation findings back to the web application in real-time. Without this infrastructure:

1. Agents cannot persist discovered sources, claims, fact-checks, or timeline events
2. The web application has no way to display investigation progress
3. Users cannot view or manage their investigation history
4. The two-column workspace (chat + canvas) cannot function without data retrieval

This phase creates the **critical data foundation** that all subsequent features depend on.

### Success Criteria
- [x] All database tables created (investigations, sources, claims, claim_sources, fact_checks, timeline_events)
- [ ] Each table has proper foreign keys and constraints
- [ ] Database migrations generated and applied successfully
- [ ] Down migrations created for safe rollback
- [ ] Callback API endpoint authenticates via shared secret
- [ ] Callback API handles all 8 callback types (SOURCE_FOUND, CLAIM_EXTRACTED, etc.)
- [ ] Query functions created for investigations, sources, and claims
- [ ] Server actions created for investigation CRUD operations
- [ ] Type-safe request validation implemented
- [ ] Error handling implemented for all callback types

---

## 5. Development Mode Context

### Development Mode Context
- **🚨 IMPORTANT: This is a new application in active development**
- **No backwards compatibility concerns** - feel free to make breaking changes
- **Data loss acceptable** - existing data can be wiped/migrated aggressively
- **Users are developers/testers** - not production users requiring careful migration
- **Priority: Speed and simplicity** over data preservation
- **Aggressive refactoring allowed** - delete/recreate components as needed

---

## 6. Technical Requirements

### Functional Requirements
- **Database Schema:**
  - User can create multiple investigations (one-to-many relationship)
  - Each investigation can have multiple sources, claims, and timeline events
  - Claims can be linked to multiple sources (many-to-many via junction table)
  - Fact-checks connect claims to sources with evidence type
  - All tables have proper timestamps (created_at, updated_at where applicable)
  
- **Callback API:**
  - Agent can authenticate using shared secret header (`X-Agent-Secret`)
  - Agent can POST different callback types with appropriate payloads
  - API validates request structure and saves to correct tables
  - API returns clear error messages for invalid requests
  - API handles concurrent callback requests from agent

- **Query Functions:**
  - Create, read, update operations for investigations
  - Retrieve all investigations for a user
  - Retrieve sources, claims by investigation ID
  - Update claim status dynamically

- **Server Actions:**
  - Form submission to create new investigation
  - Delete investigation with cascade to related records

### Non-Functional Requirements
- **Performance:** Database queries should use proper indexes for fast lookups
- **Security:** 
  - Callback API requires shared secret authentication
  - User-facing queries filter by user_id to prevent unauthorized access
  - Input validation on all callback payloads
- **Usability:** Type-safe APIs with clear error messages
- **Responsive Design:** N/A for this phase (backend only)
- **Theme Support:** N/A for this phase (backend only)
- **Compatibility:** PostgreSQL 15+ via Supabase

### Technical Constraints
- Must use Drizzle ORM for all schema definitions
- Cannot modify existing `users` or `session-names` tables
- Must run all Drizzle commands from `apps/web/` directory
- Must create down migrations before running `npm run db:migrate`
- Callback API must be stateless (no session storage)

---

## 7. Data & Database Changes

### Database Schema Changes

#### 1. Investigations Table
```typescript
// lib/drizzle/schema/investigations.ts
export const investigationModeEnum = pgEnum("investigation_mode", ["quick", "detailed"]);
export const investigationStatusEnum = pgEnum("investigation_status", [
  "pending",
  "active",
  "completed",
  "failed"
]);

export const investigations = pgTable("investigations", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  session_id: text("session_id").notNull(), // ADK session ID for agent communication (required)
  title: text("title").notNull(),
  brief: text("brief").notNull(),
  mode: investigationModeEnum("mode").notNull(),
  status: investigationStatusEnum("status").default("pending").notNull(),
  summary: text("summary"), // Nullable - agent fills later via summary_writer
  overall_bias_score: numeric("overall_bias_score", { precision: 3, scale: 2 }), // 0.00-5.00 scale (average across sources)
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index("investigations_user_id_idx").on(t.user_id),
  index("investigations_status_idx").on(t.status),
]);
```

#### 2. Sources Table
```typescript
// lib/drizzle/schema/sources.ts
export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  investigation_id: uuid("investigation_id").references(() => investigations.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(),
  title: text("title"),
  content_snippet: text("content_snippet"),
  credibility_score: integer("credibility_score"), // 1-5 stars
  bias_score: numeric("bias_score", { precision: 4, scale: 2 }), // 0.00-10.00 scale
  is_user_provided: boolean("is_user_provided").default(false).notNull(), // TRUE: user added, FALSE: agent discovered
  analyzed_at: timestamp("analyzed_at", { withTimezone: true }), // Set AFTER agent analysis complete, NULL during processing
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index("sources_investigation_id_idx").on(t.investigation_id),
  // Unique constraint: one URL per investigation
  index("sources_investigation_url_unique").on(t.investigation_id, t.url).unique(),
]);
```

#### 3. Claims Table
```typescript
// lib/drizzle/schema/claims.ts
export const claimStatusEnum = pgEnum("claim_status", [
  "verified",
  "unverified",
  "contradicted"
]);

export const claims = pgTable("claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  investigation_id: uuid("investigation_id").references(() => investigations.id, { onDelete: "cascade" }).notNull(),
  claim_text: text("claim_text").notNull(),
  status: claimStatusEnum("status").default("unverified").notNull(),
  evidence_count: integer("evidence_count").default(0).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index("claims_investigation_id_idx").on(t.investigation_id),
]);
```

#### 4. Claim-Sources Junction Table
```typescript
// lib/drizzle/schema/claim-sources.ts
export const claimSources = pgTable("claim_sources", {
  claim_id: uuid("claim_id").references(() => claims.id, { onDelete: "cascade" }).notNull(),
  source_id: uuid("source_id").references(() => sources.id, { onDelete: "cascade" }).notNull(),
}, (t) => [
  // Composite primary key
  primaryKey({ columns: [t.claim_id, t.source_id] }),
]);
```

#### 5. Fact-Checks Table
```typescript
// lib/drizzle/schema/fact-checks.ts
export const evidenceTypeEnum = pgEnum("evidence_type", ["supporting", "contradicting"]);

export const factChecks = pgTable("fact_checks", {
  id: uuid("id").primaryKey().defaultRandom(),
  claim_id: uuid("claim_id").references(() => claims.id, { onDelete: "cascade" }).notNull(),
  source_id: uuid("source_id").references(() => sources.id, { onDelete: "cascade" }).notNull(),
  evidence_type: evidenceTypeEnum("evidence_type").notNull(),
  evidence_text: text("evidence_text").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index("fact_checks_claim_id_idx").on(t.claim_id),
  index("fact_checks_source_id_idx").on(t.source_id),
]);
```

#### 6. Timeline Events Table
```typescript
// lib/drizzle/schema/timeline-events.ts
export const timelineEvents = pgTable("timeline_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  investigation_id: uuid("investigation_id").references(() => investigations.id, { onDelete: "cascade" }).notNull(),
  event_date: timestamp("event_date", { withTimezone: true }).notNull(),
  event_text: text("event_text").notNull(),
  source_id: uuid("source_id").references(() => sources.id, { onDelete: "set null" }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index("timeline_events_investigation_id_idx").on(t.investigation_id),
  index("timeline_events_event_date_idx").on(t.event_date),
]);
```

### Data Model Updates
All schemas export Zod validation schemas and TypeScript types:
```typescript
export const insertInvestigationSchema = createInsertSchema(investigations);
export const selectInvestigationSchema = createSelectSchema(investigations);
export type Investigation = InferSelectModel<typeof investigations>;
```

### Data Migration Plan
- [ ] Create all schema files first
- [ ] Generate single migration for all tables (or separate migrations per table group)
- [ ] Create down migration files for each migration
- [ ] Apply migrations to development database
- [ ] Verify tables exist in Supabase dashboard

### 🚨 MANDATORY: Down Migration Safety Protocol
**CRITICAL REQUIREMENT:** Before running ANY database migration, you MUST create the corresponding down migration file following the `drizzle_down_migration.md` template process:

- [ ] **Step 1: Generate Migration** - Run `npm run db:generate` to create the migration file
- [ ] **Step 2: Create Down Migration** - Follow `drizzle_down_migration.md` template to analyze the migration and create the rollback file
- [ ] **Step 3: Create Subdirectory** - Create `drizzle/migrations/[timestamp_name]/` directory  
- [ ] **Step 4: Generate down.sql** - Create the `down.sql` file with safe rollback operations
- [ ] **Step 5: Verify Safety** - Ensure all operations use `IF EXISTS` and include appropriate warnings
- [ ] **Step 6: Apply Migration** - Only after down migration is created, run `npm run db:migrate`

**🛑 NEVER run `npm run db:migrate` without first creating the down migration file!**

---

## 8. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**🚨 MANDATORY: Follow these rules strictly:**

#### **MUTATIONS (Server Actions)** → `app/actions/investigations.ts`
- Server Actions for investigation CRUD operations
- Must use `'use server'` directive and `revalidatePath()` after mutations

#### **QUERIES (Data Fetching)** → `lib/queries/` for complex queries
- **Complex Queries** → `lib/queries/investigations.ts`, `lib/queries/sources.ts`, `lib/queries/claims.ts`
- Use when: JOINs, aggregations, complex logic, reused in multiple places

#### **API Routes** → `app/api/agent-callback/route.ts` - **SPECIAL CASE**
- This is a valid use case for API routes: external integration (Python agent callback)
- Not a typical internal data operation

### Server Actions
- **`createInvestigationAction()`** - Create new investigation with title, brief, mode
- **`deleteInvestigationAction()`** - Delete investigation and cascade to related records

### Database Queries
- **Query Functions in lib/queries/** - Complex queries for investigations, sources, claims
  - `createInvestigation()` - Insert new investigation
  - `getInvestigation(id)` - Get investigation by ID with user validation
  - `updateInvestigation(id, data)` - Update investigation fields
  - `getUserInvestigations(userId)` - Get all investigations for a user
  - `createSource()` - Insert new source
  - `getSourcesByInvestigation(investigationId)` - Get all sources for investigation
  - `createClaim()` - Insert new claim
  - `getClaimsByInvestigation(investigationId)` - Get all claims for investigation
  - `updateClaimStatus(claimId, status)` - Update claim verification status

### API Routes (Only for Special Cases)
- **`app/api/agent-callback/route.ts`** - External API for Python agent callbacks
  - Webhook-style endpoint for agent-to-web communication
  - Authenticates via `X-Agent-Secret` header
  - Handles 8 callback types: SOURCE_FOUND, CLAIM_EXTRACTED, FACT_CHECKED, BIAS_ANALYZED, TIMELINE_EVENT, SUMMARY_UPDATED, INVESTIGATION_COMPLETE, INVESTIGATION_FAILED

### External Integrations
- **Python Agent (apps/vicaran-agent)** - Will call callback API to persist data
- **Shared Secret Authentication** - `AGENT_SECRET` env var shared between web app and agent

**🚨 MANDATORY: Use Latest AI Models**
- N/A for this phase (no AI model usage in database/API code)

---

## 9. Frontend Changes

### New Components
**N/A for this phase** - This is purely backend infrastructure (database + API). No frontend components needed yet.

### Page Updates
**N/A for this phase**

### State Management
**N/A for this phase**

---

## 10. Code Changes Overview

### 📂 **Current Implementation (Before)**
Currently, only basic user authentication tables exist:

```typescript
// lib/drizzle/schema/index.ts
export * from "./users";
export * from "./session-names";
```

No investigation-related tables, no callback API, no query functions for investigation data.

### 📂 **After Implementation**
Will have complete database schema for investigations:

```typescript
// lib/drizzle/schema/index.ts
export * from "./users";
export * from "./session-names";
export * from "./investigations";
export * from "./sources";
export * from "./claims";
export * from "./claim-sources";
export * from "./fact-checks";
export * from "./timeline-events";
```

Will have callback API for agent communication:
```typescript
// app/api/agent-callback/route.ts
export async function POST(request: Request) {
  // Authenticate via X-Agent-Secret header
  // Validate callback type and payload
  // Save to appropriate database table
  // Return success/error response
}
```

Will have query functions for data retrieval:
```typescript
// lib/queries/investigations.ts
export async function createInvestigation(data) { ... }
export async function getUserInvestigations(userId) { ... }
```

### 🎯 **Key Changes Summary**
- **6 new schema files** - investigations, sources, claims, claim-sources, fact-checks, timeline-events
- **1 new API route** - agent-callback for external agent communication
- **3 new query files** - investigations, sources, claims query functions
- **1 new server actions file** - investigation CRUD operations
- **Multiple database migrations** - with corresponding down migrations
- **Files Modified:** `lib/drizzle/schema/index.ts` (add exports)
- **Impact:** Enables agent data persistence and foundation for all investigation features

---

## 11. Implementation Plan

### Phase 1: Database Schema - Investigations Table
**Goal:** Create investigations table with proper enums and indexes

- [ ] Create `lib/drizzle/schema/investigations.ts`
  - Files: `lib/drizzle/schema/investigations.ts`
  - Details: Define investigationModeEnum, investigationStatusEnum, investigations table, indexes
- [ ] Update `lib/drizzle/schema/index.ts`
  - Files: `lib/drizzle/schema/index.ts`
  - Details: Add `export * from "./investigations";`
- [ ] Generate migration
  - Command: `npm run db:generate` (from apps/web/)
  - Details: Creates migration file in drizzle/migrations/
- [ ] Create down migration
  - Files: `drizzle/migrations/[timestamp]/down.sql`
  - Details: Follow `drizzle_down_migration.md` template
- [ ] Apply migration
  - Command: `npm run db:migrate` (from apps/web/)
  - Details: Applies migration to Supabase database

### Phase 2: Database Schema - Sources Table
**Goal:** Create sources table with foreign key to investigations

- [ ] Create `lib/drizzle/schema/sources.ts`
  - Files: `lib/drizzle/schema/sources.ts`
  - Details: Define sources table, indexes, unique constraint
- [ ] Update `lib/drizzle/schema/index.ts`
  - Files: `lib/drizzle/schema/index.ts`
  - Details: Add `export * from "./sources";`
- [ ] Generate migration, create down migration, apply migration
  - Commands: Same process as Phase 1

### Phase 3: Database Schema - Claims & Relationships
**Goal:** Create claims, claim-sources junction, and fact-checks tables

- [ ] Create `lib/drizzle/schema/claims.ts`
  - Files: `lib/drizzle/schema/claims.ts`
  - Details: Define claimStatusEnum, claims table
- [ ] Create `lib/drizzle/schema/claim-sources.ts`
  - Files: `lib/drizzle/schema/claim-sources.ts`
  - Details: Define junction table with composite primary key
- [ ] Create `lib/drizzle/schema/fact-checks.ts`
  - Files: `lib/drizzle/schema/fact-checks.ts`
  - Details: Define evidenceTypeEnum, fact_checks table
- [ ] Update `lib/drizzle/schema/index.ts`
  - Files: `lib/drizzle/schema/index.ts`
  - Details: Export all three new schemas
- [ ] Generate migration, create down migration, apply migration
  - Commands: Same process as Phase 1

### Phase 4: Database Schema - Timeline Events
**Goal:** Create timeline events table

- [ ] Create `lib/drizzle/schema/timeline-events.ts`
  - Files: `lib/drizzle/schema/timeline-events.ts`
  - Details: Define timeline_events table with foreign keys
- [ ] Update `lib/drizzle/schema/index.ts`
  - Files: `lib/drizzle/schema/index.ts`
  - Details: Add `export * from "./timeline-events";`
- [ ] Generate migration, create down migration, apply migration
  - Commands: Same process as Phase 1

### Phase 5: Query Functions - Investigations
**Goal:** Create reusable database query functions

- [ ] Create `lib/queries/investigations.ts`
  - Files: `lib/queries/investigations.ts`
  - Details: Implement createInvestigation, getInvestigation, updateInvestigation, getUserInvestigations

### Phase 6: Query Functions - Sources & Claims
**Goal:** Create query functions for sources and claims

- [ ] Create `lib/queries/sources.ts`
  - Files: `lib/queries/sources.ts`
  - Details: Implement createSource, getSourcesByInvestigation
- [ ] Create `lib/queries/claims.ts`
  - Files: `lib/queries/claims.ts`
  - Details: Implement createClaim, getClaimsByInvestigation, updateClaimStatus

### Phase 7: Callback API
**Goal:** Create secure API endpoint for agent callbacks

- [ ] Create `app/api/agent-callback/route.ts`
  - Files: `app/api/agent-callback/route.ts`
  - Details: Implement POST handler with authentication, validation, and 8 callback types
  - [ ] **Add investigation_id validation** - Verify investigation exists before processing callbacks
  - [ ] **Implement UPSERT for SOURCE_FOUND** - Handle duplicate URLs gracefully
  - [ ] **Error handling** - Log errors but don't break agent pipeline (return success with warning)

### Phase 8: Server Actions
**Goal:** Create server actions for investigation management

- [ ] Create `app/actions/investigations.ts`
  - Files: `app/actions/investigations.ts`
  - Details: Implement createInvestigationAction, deleteInvestigationAction
  - [ ] **Trigger ADK agent after DB insert** - Fetch to `ADK_URL` with investigation data
  - [ ] **Add error handling and revalidation** - Proper try/catch and revalidatePath

### Phase 9: Basic Code Validation (AI-Only)
**Goal:** Run safe static analysis only - NEVER run dev server, build, or application commands

- [ ] Code Quality Verification
  - Files: All modified files  
  - Details: Run linting and static analysis ONLY - NEVER run dev server, build, or start commands
- [ ] Static Logic Review
  - Files: Modified query functions, API routes
  - Details: Read code to verify logic syntax, edge case handling, fallback patterns
- [ ] Database Verification (read-only)
  - Files: drizzle/migrations/ folder
  - Details: Read migration files to verify schema correctness (NO live database operations beyond migrations)

🛑 **CRITICAL WORKFLOW CHECKPOINT**
After completing Phase 9, you MUST:
1. Present "Implementation Complete!" message (exact text from section 16)
2. Wait for user approval of code review  
3. Execute comprehensive code review process
4. NEVER proceed to user testing without completing code review first

### Phase 10: Comprehensive Code Review (Mandatory)
**Goal:** Present implementation completion and request thorough code review

- [ ] Present "Implementation Complete!" Message (MANDATORY)
  - Template: Use exact message from task template section 16, step 7
  - Details: STOP here and wait for user code review approval
- [ ] Execute Comprehensive Code Review (If Approved)
  - Process: Follow step 8 comprehensive review checklist from task template section 16
  - Details: Read all files, verify requirements, integration testing, provide detailed summary

### Phase 11: User Testing (Only After Code Review)
**Goal:** Request human testing for database and API functionality

- [ ] Present AI Testing Results
  - Files: Summary of schema validation results
  - Details: Provide comprehensive results of all AI-verifiable testing
- [ ] Request User Database Testing
  - Files: Specific testing checklist for user
  - Details: Verify tables exist in Supabase, test callback API with sample requests
- [ ] Wait for User Confirmation
  - Files: N/A
  - Details: Wait for user to complete testing and confirm results

---

## 12. Task Completion Tracking - MANDATORY WORKFLOW

### Task Completion Tracking - MANDATORY WORKFLOW
🚨 **CRITICAL: Real-time task completion tracking is mandatory**

- [ ] **🗓️ GET TODAY'S DATE FIRST** - Before adding any completion timestamps, get the correct current date (2026-02-02)
- [ ] **Update task document immediately** after each completed subtask
- [ ] **Mark checkboxes as [x]** with completion timestamp using ACTUAL current date
- [ ] **Add brief completion notes** (file paths, key changes, etc.) 
- [ ] **This serves multiple purposes:**
  - [ ] **Forces verification** - You must confirm you actually did what you said
  - [ ] **Provides user visibility** - Clear progress tracking throughout implementation
  - [ ] **Prevents skipped steps** - Systematic approach ensures nothing is missed
  - [ ] **Creates audit trail** - Documentation of what was actually completed
  - [ ] **Enables better debugging** - If issues arise, easy to see what was changed

### Example Task Completion Format
```
### Phase 1: Database Schema - Investigations Table
**Goal:** Create investigations table with proper enums and indexes

- [x] Create `lib/drizzle/schema/investigations.ts` ✓ 2026-02-02
  - Files: `lib/drizzle/schema/investigations.ts` created ✓
  - Details: Defined investigationModeEnum, investigationStatusEnum, investigations table with indexes ✓
- [x] Update `lib/drizzle/schema/index.ts` ✓ 2026-02-02  
  - Files: `lib/drizzle/schema/index.ts` ✓
  - Details: Added `export * from "./investigations";` ✓
- [x] Generate migration ✓ 2026-02-02
  - Command: `npm run db:generate` executed successfully ✓
  - Details: Created migration file `0001_investigations.sql` ✓
```

---

## 13. File Structure & Organization

### New Files to Create
```
apps/web/
├── lib/drizzle/schema/
│   ├── investigations.ts              # Investigation sessions schema
│   ├── sources.ts                     # Investigation sources schema
│   ├── claims.ts                      # Claims schema
│   ├── claim-sources.ts               # Many-to-many junction table
│   ├── fact-checks.ts                 # Fact check evidence schema
│   └── timeline-events.ts             # Timeline events schema
├── lib/queries/
│   ├── investigations.ts              # Investigation query functions
│   ├── sources.ts                     # Sources query functions
│   └── claims.ts                      # Claims query functions
├── app/actions/
│   └── investigations.ts              # Investigation server actions (mutations)
└── app/api/agent-callback/
    └── route.ts                       # Agent callback API endpoint
```

**File Organization Rules:**
- **Schema files**: In `lib/drizzle/schema/` directory
- **Query functions**: In `lib/queries/` directory (for complex queries)
- **Server Actions**: In `app/actions/` directory (mutations only)
- **API Routes**: In `app/api/` directory (external integrations only)

### Files to Modify
- **`lib/drizzle/schema/index.ts`** - Add exports for all new schemas

### Dependencies to Add
**No new dependencies required** - All functionality uses existing packages (Drizzle ORM, Next.js, Zod)

---

## 14. Potential Issues & Security Review

### Error Scenarios to Analyze
- [ ] **Error Scenario 1:** Foreign key constraint violations when deleting investigations
  - **Code Review Focus:** `deleteInvestigationAction()` - ensure cascade deletes are properly configured
  - **Potential Fix:** Add `onDelete: "cascade"` to all foreign key references
  
- [ ] **Error Scenario 2:** Duplicate source URLs within same investigation
  - **Code Review Focus:** `sources.ts` schema - verify unique constraint on (investigation_id, url)
  - **Potential Fix:** Ensure unique index is properly defined in schema

- [ ] **Error Scenario 3:** Callback API receives malformed payloads
  - **Code Review Focus:** `app/api/agent-callback/route.ts` - check Zod validation schemas
  - **Potential Fix:** Add comprehensive Zod schemas for each callback type

### Edge Cases to Consider
- [ ] **Edge Case 1:** Investigation deleted while agent is still processing
  - **Analysis Approach:** Check if callback API handles non-existent investigation_id gracefully
  - **Recommendation:** Return clear error message and log for debugging

- [ ] **Edge Case 2:** Concurrent callback requests from agent
  - **Analysis Approach:** Verify database handles concurrent inserts without conflicts
  - **Recommendation:** PostgreSQL handles this natively; rely on unique constraints

- [ ] **Edge Case 3:** User creates investigation but agent never calls back
  - **Analysis Approach:** Check if investigation status remains "pending" indefinitely
  - **Recommendation:** Later phase can add timeout/cleanup logic

### Security & Access Control Review
- [ ] **Admin Access Control:** N/A for this phase (no admin-only features)
- [ ] **Authentication State:** Callback API uses shared secret, not user sessions
  - **Check:** Verify `X-Agent-Secret` header validation in callback route
  - **Current approach:** Simple shared secret (password-like token) in environment variable
  - **Why it's acceptable for MVP:** Internal agent-to-server communication only, not public API
  - **Future enhancement (Phase 9):** Consider JWT tokens with expiration or API key rotation for production
- [ ] **Form Input Validation:** N/A for this phase (no user-facing forms yet)
- [ ] **Permission Boundaries:** Query functions must filter by user_id
  - **Check:** Verify `getUserInvestigations()` and `getInvestigation()` include user_id validation
- [ ] **SQL Injection:** Drizzle ORM provides parameterized queries by default
  - **Check:** Ensure no raw SQL queries are used
- [ ] **Rate Limiting:** Callback API has no rate limiting
  - **Current approach:** No request throttling or limits
  - **Why it's acceptable for MVP:** Controlled environment, low volume (~10-50 callbacks per investigation)
  - **Future enhancement (Phase 9):** Add rate limiting middleware (e.g., 100 requests/minute) for production

### AI Agent Analysis Approach
**Focus:** Review database schema for proper foreign keys, indexes, and constraints. Verify callback API authentication and input validation. Check query functions for proper user_id filtering to prevent unauthorized access.

**Priority Order:**
1. **Critical:** Shared secret authentication, user_id filtering in queries
2. **Important:** Foreign key cascades, unique constraints, Zod validation
3. **Nice-to-have:** Error messages, logging

---

## 15. Deployment & Configuration

### Environment Variables
```bash
# Add to apps/web/.env.local
AGENT_SECRET=your_shared_secret_here_random_string

# Add to apps/vicaran-agent/.env.local (for agent to use)
CALLBACK_API_URL=http://localhost:3000/api/agent-callback
AGENT_SECRET=same_shared_secret_as_web_app
```

**Note:** Generate a strong random secret for production. For development, any random string will work.

---

## 16. AI Agent Instructions

### Default Workflow - STRATEGIC ANALYSIS FIRST
✅ **STRATEGIC ANALYSIS SKIPPED** - This is a straightforward implementation following the roadmap. Proceeding directly to task document and implementation.

### Communication Preferences
- [x] Ask for clarification if requirements are unclear
- [x] Provide regular progress updates after each phase
- [x] Flag any blockers or concerns immediately
- [x] Suggest improvements or alternatives when appropriate

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Always follow this exact sequence:**

1. **EVALUATE STRATEGIC NEED FIRST (Required)**
   - [x] **Assessment complete** - Straightforward implementation, no strategic analysis needed
   - [x] **Skip to step 3** - Proceed with task document creation

3. **CREATE TASK DOCUMENT THIRD (Required)**
   - [x] **Task document created** - `ai_docs/tasks/001_phase3_database_callback_api.md`
   - [x] **All sections filled** - Based on roadmap Phase 3 specifications
   - [x] **Task number assigned** - Using 001 (first task in directory)
   - [x] **Code changes populated** - Section 10 shows before/after structure
   - [x] **Ready for user review**

4. **PRESENT IMPLEMENTATION OPTIONS (Required)**
   
   **👤 IMPLEMENTATION OPTIONS:**
   
   **A) Preview High-Level Code Changes** 
   Would you like me to show you detailed code snippets and specific schema definitions before implementing? I'll walk through exactly what each database table will look like and show callback API implementation examples.
   
   **B) Proceed with Implementation**
   Ready to begin implementation? Say "Approved" or "Go ahead" and I'll start implementing phase by phase, creating each schema file, generating migrations, and building the callback API.
   
   **C) Provide More Feedback** 
   Have questions or want to modify the approach? I can adjust the plan based on additional requirements or clarify any aspects of the database schema or callback API design.

**Questions for clarification:**
- Does the database schema structure match your understanding from the roadmap?
- Do you have any concerns about the callback API design (authentication, callback types)?
- Should I proceed with implementation, or would you like to see detailed code examples first?

---

## 17. Notes & Additional Context

### Research Links
- Roadmap: `ai_docs/prep/roadmap.md` (Phase 3: Lines 79-153)
- Phase 3 Prompt: `.gemini/antigravity/brain/0c11c094-7be6-4823-86a9-b6e12997ed79/phase3_prompt.md.resolved`
- Drizzle Down Migration Template: `ai_docs/dev_templates/drizzle_down_migration.md`
- Existing Users Schema: `lib/drizzle/schema/users.ts` (pattern reference)

### Database Schema Notes
- **Investigation Flow:** User creates investigation → Agent processes → Agent calls back with results → Data displayed in workspace
- **Foreign Key Cascades:** All related tables use `onDelete: "cascade"` so deleting an investigation cleans up all related data
- **Indexes:** Added on frequently queried columns (user_id, investigation_id, status) for performance
- **Many-to-Many:** Claims and Sources use junction table `claim_sources` for flexibility
- **Session ID (session_id):** Required field linking investigation to ADK agent session for real-time tracking
- **User-Provided Sources (is_user_provided):** 
  - `TRUE` = User manually added (initial sources or mid-investigation additions) - prioritized for analysis
  - `FALSE` = Agent discovered via Tavily Search or web scraping
- **Bias Scoring System:**
  - **Per-Source Bias (`sources.bias_score`):** DECIMAL(4,2) supporting 0.00 to 10.00
    - 0.00 = No detectable bias
    - 5.00 = Moderate bias  
    - 10.00 = Extremely biased
  - **Overall Investigation Bias (`investigations.overall_bias_score`):** DECIMAL(3,2) supporting 0.00 to 5.00
    - Calculated as average across all source bias scores
    - Lower range reflects aggregate normalization

### Callback API Notes
- **Stateless Design:** No session storage; each callback is independent
- **Authentication:** Shared secret in header (simple but effective for agent-to-server communication)
- **Callback Types:** 8 types cover all agent events (source found, claim extracted, etc.)
- **Error Handling:** Return clear JSON error messages for debugging

### Implementation Clarifications (User-Confirmed)
1. **Summary Field:** NULL until agent generates it (not empty string)
2. **Callback Validation:** Always verify `investigation_id` exists before processing
3. **Agent Triggering:** Server action (`createInvestigationAction`) triggers ADK agent after DB insert
4. **Error Handling:** Use UPSERT for duplicate sources, log but don't fail pipeline
5. **analyzed_at Timestamp:** Set AFTER agent completes analysis, NULL during processing

---

## 18. Second-Order Consequences & Impact Analysis

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing API Contracts:** No existing investigation APIs; this is net new functionality
- [ ] **Database Dependencies:** New tables don't conflict with existing `users` or `session-names` tables
- [ ] **Component Dependencies:** No frontend components exist yet for investigations
- [ ] **Authentication/Authorization:** Uses existing user authentication; callback API uses separate shared secret

**Result:** ✅ No breaking changes - This is additive functionality

#### 2. **Ripple Effects Assessment**
- [ ] **Data Flow Impact:** Creates foundation for all future investigation features
- [ ] **UI/UX Cascading Effects:** No UI changes in this phase; enables future workspace UI
- [ ] **State Management:** No state management needed yet; future phases will add React Query
- [ ] **Routing Dependencies:** No route dependencies yet; callback API is independent endpoint

**Result:** ✅ Positive ripple effects - Enables all subsequent roadmap phases

#### 3. **Performance Implications**
- [ ] **Database Query Impact:** New indexes ensure fast lookups; no impact on existing queries
- [ ] **Bundle Size:** Backend-only changes; no client-side bundle impact
- [ ] **Server Load:** Callback API is lightweight; agent calls are infrequent (per investigation)
- [ ] **Caching Strategy:** No caching needed yet; future phases will add React Query caching

**Result:** ✅ No negative performance impact

#### 4. **Security Considerations**
- [ ] **Attack Surface:** Callback API requires shared secret; low risk for authenticated users
- [ ] **Data Exposure:** Query functions filter by user_id; proper authorization
- [ ] **Permission Escalation:** No role-based features yet; standard user access only
- [ ] **Input Validation:** Zod schemas validate all callback payloads

**Result:** ⚠️ **YELLOW FLAG** - Shared secret authentication is simple but sufficient for agent-to-server. Consider token-based auth or mutual TLS for production.

#### 5. **User Experience Impacts**
- [ ] **Workflow Disruption:** No user-facing changes; purely backend infrastructure
- [ ] **Data Migration:** No existing investigation data to migrate
- [ ] **Feature Deprecation:** No features being removed
- [ ] **Learning Curve:** No user impact in this phase

**Result:** ✅ No UX impact in this phase

#### 6. **Maintenance Burden**
- [ ] **Code Complexity:** Standard Drizzle ORM patterns; well-organized schema files
- [ ] **Dependencies:** No new dependencies; uses existing Drizzle, Next.js, Zod
- [ ] **Testing Overhead:** Future phases will need integration tests for callback API
- [ ] **Documentation:** Roadmap and task doc provide clear documentation

**Result:** ✅ Low maintenance burden - Follows established patterns

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**
**None identified** - This is foundational infrastructure with no critical risks

#### ⚠️ **YELLOW FLAGS - Discuss with User**
- [ ] **Shared Secret Authentication:** Simple but less secure than token-based auth
  - **Discussion Point:** Is shared secret authentication sufficient for hackathon MVP? Production may need OAuth or API keys.
  - **Mitigation:** Document need for enhanced auth in post-hackathon Phase 9

- [ ] **No Rate Limiting:** Callback API has no rate limiting
  - **Discussion Point:** Should we add basic rate limiting to prevent abuse?
  - **Mitigation:** Can add in future phase if needed; low priority for hackathon

### Mitigation Strategies

#### Database Changes
- [x] **Backup Strategy:** Supabase provides automatic backups
- [x] **Rollback Plan:** Down migrations created for every schema change
- [x] **Staging Testing:** Development database first; production later
- [x] **Gradual Migration:** New tables; no data migration needed

#### API Changes
- [x] **Versioning Strategy:** N/A - This is initial API version
- [x] **Deprecation Timeline:** N/A - No existing APIs to deprecate
- [x] **Client Communication:** Only Python agent calls this API; internal communication
- [x] **Graceful Degradation:** N/A - New functionality

### AI Agent Checklist

Before presenting the task document to the user, the AI agent must:
- [x] **Complete Impact Analysis:** Reviewed all impact categories
- [x] **Identify Critical Issues:** No red flags; two yellow flags identified
- [x] **Propose Mitigation:** Document need for enhanced auth in future phase
- [x] **Alert User:** Yellow flags noted in implementation options
- [x] **Recommend Alternatives:** Shared secret is sufficient for MVP; can enhance later

### Example Analysis Template

```
🔍 **SECOND-ORDER IMPACT ANALYSIS:**

**Breaking Changes Identified:**
- None - This is net new functionality

**Performance Implications:**
- New indexes ensure fast queries
- No impact on existing system performance

**Security Considerations:**
- Shared secret authentication for callback API (simple but sufficient for MVP)
- Query functions properly filter by user_id

**User Experience Impacts:**
- No user-facing changes in this phase
- Enables all future investigation UI features

**Mitigation Recommendations:**
- Create down migrations before every migration (mandatory)
- Document need for enhanced auth in Phase 9 (post-hackathon)
- Consider rate limiting for production deployment

**✅ NO CRITICAL ISSUES - SAFE TO PROCEED**
All identified concerns are minor and can be addressed in post-hackathon phases.
```

---

*Template Version: 1.3*  
*Task Created: 2026-02-02*  
*Task Number: 001*
