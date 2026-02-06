# Task: Fix Agent Callback 404 (Investigation Not Found)

> **Instructions:** This task documents the analysis and fix for the 404 error encountered when the agent sends callbacks to the web application.

---

## 1. Task Overview

### Task Title
**Title:** Fix Agent Callback 404 Error & Logic for New Investigations

### Goal Statement
**Goal:** Resolve the critical issue where `INVESTIGATION_STARTED` callbacks return 404 because the investigation ID does not exist in the database. The agent must be able to create new investigations via the callback API using a specific fallback User ID.

---

## 2. Strategic Analysis

### Problem Context
The Agent generates a new UUID for each run and sends an `INVESTIGATION_STARTED` callback. The current endpoint `api/agent-callback`:
1.  Checks if the ID exists in the DB.
2.  If not, returns `404 Investigation not found`.
3.  Even if we skip the check, we cannot insert it because the `investigations` table requires a valid `user_id` (Foreign Key).

### Solution Options Analysis

#### Option 1: Upsert with Specific User ID (Recommended)
**Approach:** Modify `route.ts` to allow `INVESTIGATION_STARTED` to bypass the 404 check and perform an UPSERT (create if missing) using a specific hardcoded User ID provided by the project lead.

**Pros:**
-   ✅ Immediate fix for standalone agent runs.
-   ✅ Ensures data integrity (valid FK).
-   ✅ Robust (no "investigation not found" errors).

**Cons:**
-   ❌ Hardcoding IDs is generally anti-pattern (but acceptable here for "System/Bot" user).

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 1 - Modify Route to Upsert with Specific User ID.

**Why this is the best choice:**
The agent runs independently and needs a "user" context to own the data. The user has explicitly provided the ID `10977548-ef5f-49cb-9819-72d757556809` for this purpose.

---

## 3. Project Analysis & Current State

### Current State
-   **File:** `apps/web/app/api/agent-callback/route.ts`
-   **Status:** Broken for new investigations. Logic enforces existence of ID before processing.
-   **Database:** `investigations` table requires `user_id` (FK to `users.id`) and `session_id`.

## 4. Context & Problem Definition

### Problem Statement
When the agent starts, it calls the callback API. The API rejects the call because:
1.  It validates that `investigation_id` exists (it doesn't).
2.  The schema requires a `user_id` to create it.

### Success Criteria
-   [ ] `INVESTIGATION_STARTED` callback returns `200 OK`.
-   [ ] New investigation is created in the database.
-   [ ] Investigation allows ownership by `10977548-ef5f-49cb-9819-72d757556809`.

---

## 5. Technical Requirements

### Functional Requirements
-   **Upsert Logic:** If `INVESTIGATION_STARTED` received, checks for ID. If missing, CREATE new record.
-   **Fallback User:** Use ID `10977548-ef5f-49cb-9819-72d757556809` for creations.
-   **Default Metadata:** Set `title="New Investigation"`, `mode="quick"`, `status="active"`.

---

## 10. Code Changes Overview

#### 📂 **Current Implementation (Before)**
```typescript
// Rejects unknown IDs
if (investigationId) {
    const [inv] = await db.select()...;
    if (!inv) return 404;
}
// Only updates existing
case "INVESTIGATION_STARTED":
    await db.update(investigations)...
```

#### 📂 **After Refactor**
```typescript
// Skips check for START event
if (investigationId && callbackType !== "INVESTIGATION_STARTED") {
    // ... validation ...
}

// Upserts new record
case "INVESTIGATION_STARTED":
    const FALLBACK_USER_ID = "10977548-ef5f-49cb-9819-72d757556809";
    await db.insert(investigations).values({
        id: payload.investigation_id,
        user_id: FALLBACK_USER_ID,
        // ...
    }).onConflictDoUpdate(...);
```

---

## 11. Implementation Plan

### Phase 1: Route Logic Update
**Goal:** Enable agent to create investigations.

-   [ ] **Task 1.1:** Update `apps/web/app/api/agent-callback/route.ts`
    -   Details: Implement upsert logic with the specific User ID `10977548-ef5f-49cb-9819-72d757556809`.

### Phase 2: Verification
**Goal:** Prove it works.

-   [ ] **Task 2.1:** Run `test_callback.py` script.
    -   Details: Ensure it returns 200 OK.
