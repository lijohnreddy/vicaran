# ✅ FIXED: Callback API Returning HTML Instead of JSON

> **Task ID:** 002
> **Priority:** High - Blocks ADK agent integration
> **Created:** 2026-02-03
> **Status:** ✅ RESOLVED

---

## 🎉 Resolution Summary

**Root Cause:** Middleware auth redirect was blocking unauthenticated API requests
**Fix Applied:** Added skip logic in `lib/supabase/middleware.ts` for `/api/agent-callback`
**Verification:** API now returns `401 Unauthorized` (correct behavior) instead of HTML

---

## ⚡ STEP 2: Quick Assessment

Based on error message, this looks like:
- [ ] Simple Fix (typo, syntax, obvious one-liner)
- [ ] Missing File/Import (404, import errors, file not found)
- [ ] Type/Interface Issue (TypeScript errors, wrong data types)
- [x] **Environment/Config** (Route not being recognized by Next.js)
- [ ] Complex System Issue (requires deeper investigation)

---

## 🔍 STEP 3: Root Cause Analysis

### ❌ Option A: Cache Clear - FAILED
Cleared `.next` folder and restarted server. Issue persisted.

### ✅ ROOT CAUSE FOUND: Middleware Auth Redirect

**File:** `lib/supabase/middleware.ts`

**Problem (Lines 63-68):**
```typescript
if (!user && !isPublicRoute) {
  const url = request.nextUrl.clone();
  url.pathname = "/auth/login";
  return NextResponse.redirect(url);
}
```

**What's happening:**
1. ADK agent sends POST to `/api/agent-callback` (no auth cookies)
2. Middleware calls `supabase.auth.getUser()` → returns `null` (no user)
3. `/api/agent-callback` is NOT in `publicRoutes` or `publicPatterns`
4. Middleware redirects to `/auth/login`
5. Since it's an API call, browser shows HTML instead of JSON

**Current Skip List (Lines 6-18):**
- `/api/webhooks/` ✅ skipped
- `/api/health` ✅ skipped
- `/api/agent-callback` ❌ NOT skipped (this is the bug!)

### 🎯 Solution

Add `/api/agent-callback` to the skip list in middleware:

```typescript
// Skip authentication for agent callback endpoint
if (request.nextUrl.pathname.startsWith("/api/agent-callback")) {
  return NextResponse.next({
    request,
  });
}
```

---

## 📋 STEP 4: Verification Commands

### Test 1: Verify Route File Exists
```powershell
# Should show the file exists with ~14KB size
Get-Item "apps\web\app\api\agent-callback\route.ts"
```

### Test 2: Clear Cache and Restart Server
```powershell
# Stop server (Ctrl+C), then:
Remove-Item -Recurse -Force "apps\web\.next"
cd apps\web
npm run dev
```

### Test 3: Test Callback API (After Restart)
```powershell
# Should return JSON error (no auth)
Invoke-RestMethod -Uri "http://localhost:3000/api/agent-callback" -Method POST -ContentType "application/json" -Body '{}'
```

### Test 4: Test Health Endpoint (Sanity Check)
```powershell
# Verify other API routes work
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET
```

---

## 🎯 STEP 5: Implementation Plan

### Option A: Simple Cache Clear (Recommended First)
**Complexity:** Low
**Risk:** None
**Steps:**
1. Stop the dev server
2. Delete `.next` folder
3. Restart dev server
4. Test callback API

### Option B: Check Middleware Config (If Option A Fails)
**Complexity:** Medium
**Risk:** Low
**Steps:**
1. View `middleware.ts` or `proxy.ts`
2. Check if `/api/agent-callback` is being redirected
3. Add explicit exception if needed

### Option C: Debug Imports (If Options A & B Fail)
**Complexity:** Medium
**Risk:** Low
**Steps:**
1. Add console.log at start of route.ts
2. Check terminal for errors when route is accessed
3. Fix any broken imports

---

## ✅ Success Criteria

- [ ] POST to `/api/agent-callback` returns JSON (not HTML)
- [ ] Without auth header: Returns `{"error": "Unauthorized - Invalid agent secret"}` with 401
- [ ] With valid auth + invalid investigation_id: Returns `{"error": "Investigation not found"}` with 404
- [ ] All 8 callback types work correctly

---

## 📊 Impact Assessment

**Immediate Impact:** Blocks all ADK agent integration
- Agent cannot save sources to database
- Agent cannot save claims, fact-checks, timeline events
- Investigation workflow is completely broken

**Downstream Impact:** 
- Graph tab has no data (no sources/claims to visualize)
- Dashboard tabs are empty
- Brief tab never updates

**Priority:** **HIGH** - Must fix before continuing Phase 4+

---

## 🎯 Recommended Action

**START WITH OPTION A:** Clear cache and restart

This is the most common cause for new API routes not being recognized. If this doesn't work, we'll escalate to Option B (middleware check).

Ready to proceed?
