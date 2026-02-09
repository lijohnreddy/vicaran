# Fix ADK PgBouncer Compatibility Issue

**Type:** 🟢 SIMPLE TASK  
**Created:** 2026-02-07

---

## Problem

The ADK agent fails to create sessions when connecting to Supabase via the **transaction pooler** (port 6543). The error is:

```
asyncpg.exceptions.DuplicatePreparedStatementError: 
prepared statement "__asyncpg_stmt_1__" already exists
NOTE: pgbouncer with pool_mode set to "transaction" does not support prepared statements
```

**Root Cause:** Supabase's transaction pooler (PgBouncer) doesn't support asyncpg's prepared statement cache. ADK's `DatabaseSessionService` uses asyncpg internally.

---

## Solution

**Use Supabase's Session Pooler (port 5432)** instead of the Transaction Pooler (port 6543).

Supabase provides multiple connection methods:
- **Transaction Pooler (6543)** - For serverless/high-concurrency, but conflicts with asyncpg
- **Session Pooler (5432)** - Maintains dedicated connections, compatible with asyncpg

---

## Implementation

- [x] **Task 1:** Update DATABASE_URL in `.env.local` ✓ 2026-02-07
  - Files: `apps/vicaran-agent/.env.local`
  - Change: Replace port `6543` with `5432` in the DATABASE_URL
  - Before: `postgresql+asyncpg://...pooler.supabase.com:6543/postgres`
  - After: `postgresql+asyncpg://...pooler.supabase.com:5432/postgres`

- [x] **Task 2:** Remove the URL modification in run_adk_api.py (cleanup) ✓ 2026-02-07
  - Files: `apps/vicaran-agent/scripts/run_adk_api.py`
  - Change: Remove the `prepared_statement_cache_size` URL modification code (not needed with session pooler)

- [ ] **Task 3:** Restart ADK server and test

---

## Files to Modify

| File | Change |
|------|--------|
| `apps/vicaran-agent/.env.local` | Change port from 6543 to 5432 |
| `apps/vicaran-agent/scripts/run_adk_api.py` | Remove URL modification code |

---

**Time Estimate:** 5 minutes
