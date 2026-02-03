# Task Review Checklist (adk-agent-simple)

> **Note:** This checklist is tailored for the **adk-agent-simple** template, which is a monorepo with:
> - Frontend Next.js app at `apps/web/`
> - Python ADK agents at `apps/competitor-analysis-agent/`
>
> All path references below are relative to the monorepo root.

Use this checklist to verify implementation quality before marking a task complete. Run through each section systematically.

---

## 1. Type Safety (TypeScript)

### 1.1 No `any` Types
```bash
# Search for any types in changed files
grep -r "any" --include="*.ts" --include="*.tsx" <changed-files>
```

**Check for:**
- [ ] No explicit `any` type annotations
- [ ] No implicit `any` from missing types
- [ ] Proper generics used where needed

### 1.2 Explicit Return Types
```typescript
// ❌ Bad
async function getUser(id: string) {
  return await db.query.users.findFirst({ where: eq(users.id, id) });
}

// ✅ Good
async function getUser(id: string): Promise<User | undefined> {
  return await db.query.users.findFirst({ where: eq(users.id, id) });
}
```

**Check for:**
- [ ] All functions have explicit return types
- [ ] Async functions return `Promise<T>`
- [ ] Void functions explicitly return `void` or `Promise<void>`

### 1.3 No Type Assertions Without Justification
```typescript
// ❌ Bad - hiding potential issues
const user = data as User;

// ✅ Good - validate first
if (isUser(data)) {
  const user = data;
}
```

---

## 2. Type Safety (Python/ADK)

### 2.1 No `Any` Type
```python
# ❌ Bad - using Any
from typing import Any

def process_data(data: Any) -> Any:
    return data

# ✅ Good - use specific types from ADK libraries
from google.adk.agents import Agent
from google.adk.tools import Tool

def process_data(data: dict[str, str]) -> dict[str, str]:
    return data
```

**Check for:**
- [ ] No `Any` type annotations
- [ ] Use specific types from ADK libraries (Agent, Tool, etc.)
- [ ] Proper type hints for all parameters and return values

### 2.2 Explicit Return Type Annotations
```python
# ❌ Bad - missing return type
def get_agent_config():
    return {"name": "agent"}

async def run_agent(query):
    pass

# ✅ Good - explicit return types (including -> None)
def get_agent_config() -> dict[str, str]:
    return {"name": "agent"}

async def run_agent(query: str) -> None:
    pass
```

**Check for:**
- [ ] All functions have explicit return type annotations
- [ ] Async functions use proper async return types
- [ ] Functions returning nothing use `-> None`

### 2.3 Modern Python Syntax
```python
# ❌ Bad - legacy typing syntax
from typing import Dict, List, Optional, Union

def process(items: List[Dict[str, str]]) -> Optional[str]:
    pass

def get_value(key: str) -> Union[str, int]:
    pass

# ✅ Good - modern syntax (Python 3.10+)
def process(items: list[dict[str, str]]) -> str | None:
    pass

def get_value(key: str) -> str | int:
    pass
```

**Check for:**
- [ ] Use `dict[str, str]` not `Dict[str, str]`
- [ ] Use `list[str]` not `List[str]`
- [ ] Use `str | None` not `Optional[str]`
- [ ] Use `str | int` not `Union[str, int]`

---

## 3. ADK-Specific Patterns

### 3.1 Agent Export Requirement
```python
# ❌ Bad - agent not exported correctly
agent = Agent(name="my-agent")

# ✅ Good - export as root_agent
from google.adk.agents import Agent

root_agent = Agent(
    name="competitor-analysis-agent",
    model="gemini-2.0-flash",
    # ...
)
```

**Check for:**
- [ ] Agent is exported as `root_agent` variable
- [ ] Agent has proper name and model configuration

### 3.2 Session State Management
```python
# ✅ Use output_key for session state
from google.adk.agents import Agent

root_agent = Agent(
    name="my-agent",
    output_key="analysis_result",  # Stores output in session state
    # ...
)

# Access in subsequent agents
# state["analysis_result"] contains the output
```

**Check for:**
- [ ] Use `output_key` for storing agent outputs in session state
- [ ] Session state accessed correctly across agent chain

### 3.3 Centralized Configuration
```python
# ❌ Bad - scattered os.getenv calls
import os

api_key = os.getenv("GOOGLE_API_KEY")
model = os.getenv("MODEL_NAME", "gemini-2.0-flash")

# ✅ Good - use centralized config
from config import settings

api_key = settings.google_api_key
model = settings.model_name
```

**Check for:**
- [ ] Use centralized config module over direct `os.getenv()` calls
- [ ] Environment variables documented in `.env.example`

---

## 4. Drizzle ORM

### 4.1 Type-Safe Operators (No Raw SQL)
```typescript
// ❌ Bad - SQL injection risk
sql`${column} = ANY(${array})`;
where: sql`user_id = ${userId}`;

// ✅ Good - Type-safe operators
import { eq, inArray, and, or, isNull, like, between } from 'drizzle-orm';
where: eq(users.id, userId);
where: inArray(posts.status, ['draft', 'published']);
```

**Available operators:** `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `inArray`, `notInArray`, `and`, `or`, `isNull`, `isNotNull`, `like`, `ilike`, `between`

### 4.2 Proper Transaction Usage
```typescript
// ✅ Good - atomic operations
await db.transaction(async (tx) => {
  await tx.insert(orders).values(orderData);
  await tx.update(inventory).set({ quantity: sql`quantity - 1` });
});
```

### 4.3 Select Only Needed Columns
```typescript
// ❌ Bad - fetching everything
const users = await db.select().from(usersTable);

// ✅ Good - specific columns
const users = await db.select({
  id: usersTable.id,
  email: usersTable.email,
}).from(usersTable);
```

---

## 5. Next.js 15 Patterns

### 5.1 Async Params/SearchParams
```typescript
// ✅ Server Components - await the promises
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ query?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { query } = await searchParams;
}

// ✅ Client Components - use React's use() hook
'use client';
import { use } from 'react';

export default function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
}
```

### 5.2 revalidatePath with Dynamic Routes
```typescript
// Static paths - type parameter is optional
revalidatePath('/dashboard');
revalidatePath('/settings');

// Dynamic routes - MUST include type parameter
// ❌ Bad - missing type parameter for dynamic route
revalidatePath('/agents/[agentId]');

// ✅ Good - include type parameter for dynamic routes
revalidatePath('/agents/[agentId]', 'page');
revalidatePath('/api/agents', 'layout');
```

### 5.3 No Async Client Components
```typescript
// ❌ Bad - async client component
'use client';
export default async function Component() { // ERROR
  const data = await fetchData();
}

// ✅ Good - use hooks for data fetching
'use client';
import { useEffect, useState } from 'react';

export default function Component() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData().then(setData);
  }, []);
}
```

---

## 6. Server/Client Separation

### 6.1 File Naming Convention
```
apps/web/lib/
├── storage-client.ts    # Client-safe: constants, types, pure functions
├── storage.ts           # Server-only: DB access, can re-export from -client
├── auth-client.ts       # Client-safe auth utilities
└── auth.ts              # Server-only auth (createClient, etc.)
```

### 6.2 No Mixed Imports
```typescript
// ❌ Bad - mixed concerns in one file
// apps/web/lib/utils.ts
import { createClient } from '@/lib/supabase/server';  // Server-only
export const MAX_SIZE = 10 * 1024 * 1024;              // Client-safe

// ✅ Good - separate files
// apps/web/lib/utils-client.ts
export const MAX_SIZE = 10 * 1024 * 1024;

// apps/web/lib/utils.ts
import { createClient } from '@/lib/supabase/server';
export { MAX_SIZE } from './utils-client';
```

### 6.3 Server-Only Imports Check
```typescript
// These imports are SERVER-ONLY - never import in 'use client' files:
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/drizzle';
import { headers, cookies } from 'next/headers';
```

---

## 7. Security

### 7.1 Authentication on Protected Routes
```typescript
// ✅ Every protected API route must check auth
// apps/web/app/api/agents/route.ts
export async function POST(request: Request): Promise<Response> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ... rest of handler
}
```

### 7.2 Public Routes Configuration
Public routes are configured in `apps/web/lib/supabase/middleware.ts`:

```typescript
// apps/web/lib/supabase/middleware.ts
const publicRoutes = ["/", "/cookies", "/privacy", "/terms"];
const publicPatterns = ["/auth"];

const isPublicRoute =
  publicRoutes.includes(request.nextUrl.pathname) ||
  publicPatterns.some((pattern) =>
    request.nextUrl.pathname.startsWith(pattern)
  );
```

**When adding new public routes:**
- [ ] Add exact paths to `publicRoutes` array
- [ ] Add prefix patterns to `publicPatterns` array
- [ ] Webhooks are auto-skipped: `/api/webhooks/*`

### 7.3 Input Validation
```typescript
// ✅ Validate all user input
import { z } from 'zod';

const RunAgentSchema = z.object({
  query: z.string().min(1).max(2000),
  agentId: z.string().uuid(),
});

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  const result = RunAgentSchema.safeParse(body);

  if (!result.success) {
    return Response.json({ error: result.error.issues }, { status: 400 });
  }

  // Use result.data - it's typed!
}
```

### 7.4 No Secrets in Client Code
```typescript
// ❌ Bad - exposing secrets
const apiKey = process.env.GOOGLE_API_KEY; // In client component

// ✅ Good - only NEXT_PUBLIC_ vars in client
const publicUrl = process.env.NEXT_PUBLIC_APP_URL;
```

---

## 8. Error Handling

### 8.1 Consistent Error Responses
```typescript
// ✅ Standard error response format
return Response.json(
  { error: 'Agent not found' },
  { status: 404 }
);

// ✅ With details for validation errors
return Response.json(
  { error: 'Validation failed', details: result.error.issues },
  { status: 400 }
);
```

### 8.2 Try-Catch for External Calls
```typescript
// ✅ Wrap external API calls (including ADK agent calls)
try {
  const response = await runAgent(query);
  return Response.json({ result: response });
} catch (error) {
  console.error('Agent error:', error);
  return Response.json(
    { error: 'Agent service unavailable' },
    { status: 503 }
  );
}
```

### 8.3 Database Error Handling
```typescript
// ✅ Handle database errors gracefully
try {
  await db.insert(agentRuns).values(runData);
} catch (error) {
  if (error.code === '23505') { // Unique violation
    return Response.json({ error: 'Run already exists' }, { status: 409 });
  }
  console.error('Database error:', error);
  return Response.json({ error: 'Database error' }, { status: 500 });
}
```

---

## 9. Server Actions

### 9.1 Proper Server Action Structure
```typescript
// ✅ Server action with auth check
// apps/web/app/actions/agent-actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function runAgent(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'Unauthorized' };
  }

  const query = formData.get('query') as string;

  // Validate input
  if (!query || query.length < 1) {
    return { error: 'Query is required' };
  }

  // Perform action
  // ...

  revalidatePath('/agents', 'page');
  return {};
}
```

### 9.2 Return Types for Actions
```typescript
// ✅ Define clear return types
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createAgentRun(data: CreateRunInput): Promise<ActionResult<{ id: string }>> {
  // ...
  return { success: true, data: { id: run.id } };
}
```

---

## 10. Code Quality

### 10.1 No TODO/FIXME in Production Code
```bash
# Check for leftover TODOs in TypeScript
grep -r "TODO\|FIXME\|XXX\|HACK" --include="*.ts" --include="*.tsx" apps/web/

# Check for leftover TODOs in Python
grep -r "TODO\|FIXME\|XXX\|HACK" --include="*.py" apps/competitor-analysis-agent/
```

### 10.2 No Console Statements (Except Error Logging)
```typescript
// ❌ Bad - debug logging
console.log('user:', user);

// ✅ OK - error logging
console.error('Failed to run agent:', error);
```

### 10.3 No Commented-Out Code
```typescript
// ❌ Bad - dead code
// const oldImplementation = () => { ... };

// ✅ Good - remove it entirely, git has history
```

### 10.4 Consistent Naming
**TypeScript:**
- **Files:** kebab-case (`agent-runner.tsx`)
- **Components:** PascalCase (`AgentRunner`)
- **Functions:** camelCase (`runAgent`)
- **Constants:** SCREAMING_SNAKE_CASE (`MAX_QUERY_LENGTH`)
- **Types/Interfaces:** PascalCase (`AgentConfig`, `CreateRunInput`)

**Python:**
- **Files:** snake_case (`agent_runner.py`)
- **Classes:** PascalCase (`AgentRunner`)
- **Functions:** snake_case (`run_agent`)
- **Constants:** SCREAMING_SNAKE_CASE (`MAX_QUERY_LENGTH`)

---

## 11. Testing Checklist

### 11.1 Manual Testing
- [ ] Happy path works as expected
- [ ] Error states handled gracefully
- [ ] Loading states display correctly
- [ ] Auth redirects work properly
- [ ] Agent responses render correctly

### 11.2 Edge Cases
- [ ] Empty states handled
- [ ] Invalid input rejected
- [ ] Unauthorized access blocked
- [ ] Network errors handled
- [ ] Agent timeout handled

### 11.3 Type Checking
```bash
# Run TypeScript compiler (from apps/web/)
cd apps/web && npm run typecheck
# or
cd apps/web && npx tsc --noEmit

# Run Python type checker (from apps/competitor-analysis-agent/)
cd apps/competitor-analysis-agent && mypy .
# or
cd apps/competitor-analysis-agent && pyright
```

---

## 12. Final Verification

Before marking complete, verify:

**TypeScript (apps/web/):**
- [ ] `npm run typecheck` passes (or `npx tsc --noEmit`)
- [ ] `npm run lint` passes
- [ ] No `any` types introduced
- [ ] All functions have explicit return types
- [ ] Server/client separation maintained
- [ ] Auth checks on all protected routes
- [ ] Input validation on all user input
- [ ] Error handling is consistent
- [ ] No debug console.logs left behind
- [ ] revalidatePath includes type parameter for dynamic routes

**Python (apps/competitor-analysis-agent/):**
- [ ] No `Any` types used
- [ ] All functions have explicit return type annotations (including `-> None`)
- [ ] Modern syntax used (`dict[str, str]`, `str | None`)
- [ ] Agent exports `root_agent` variable
- [ ] Centralized config used over `os.getenv()`
- [ ] Type checker passes (mypy or pyright)

---

## Quick Reference: Common Mistakes

| Mistake | Fix |
|---------|-----|
| `any` type (TS) | Use specific type or generic |
| `Any` type (Python) | Use specific ADK types |
| Missing return type | Add explicit `: ReturnType` or `-> Type` |
| Raw SQL in Drizzle | Use `eq`, `inArray`, etc. |
| Async client component | Use `useEffect` + `useState` |
| Missing auth check | Add `getUser()` check first |
| `revalidatePath('/path/[id]')` | `revalidatePath('/path/[id]', 'page')` |
| Server import in client | Create `-client.ts` file |
| `console.log` debugging | Remove or change to `console.error` |
| `Dict[str, str]` (Python) | Use `dict[str, str]` |
| `Optional[str]` (Python) | Use `str \| None` |
| Direct `os.getenv()` | Use centralized config |
| Agent not exported | Export as `root_agent` |
