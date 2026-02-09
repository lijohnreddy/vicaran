# Task: Fix Investigation ID Not Passed to Agent

## Status: ✅ COMPLETED

## Problem
Frontend creates investigation with correct ID, but agent generates mock ID because message doesn't include investigation metadata.

## Solution Implemented
Updated 6 files to pass `investigationId` through the entire chain:

| File | Change |
|------|--------|
| `adk.ts` | Added `investigationId` param to `createSessionWithMessage` |
| `request-handler.ts` | Added `investigationId` to all handlers, formats message |
| `request-types.ts` | Updated `RequestHandler` interface |
| `useChatMessageFlow.ts` | Added `investigationId` to hook config |
| `ChatStateContext.tsx` | Added `investigationId` to provider props |
| `InvestigationChat.tsx` | Passes `investigation.id` to provider |

## Message Format
Messages now include investigation metadata:
```
Investigation ID: 6d98fdee-d7e4-4301-841d-f82d3b2abc23

User's original message here...
```

## Verification Steps
- [ ] Create new investigation
- [ ] Check ADK terminal - should NOT show mock ID warning
- [ ] Verify dashboard displays sources/claims/timeline
