Implement the following plan:

# GLM Usage Display Implementation Plan

## Context

T3 Code users with GLM Coding Plan (Claude Code/GLM models) need to see their 5-hour token quota usage. The zai-usage-tracker VS Code extension demonstrates the required API integration and display pattern.

## Goal

Add a compact usage indicator that shows 5-hour token quota percentage when GLM models (GLM-5, GLM-4.7, GLM-4.5-Air) are selected, with auto-refresh capability.

## API Details

**Endpoint**: `GET https://api.z.ai/api/monitor/usage/quota/limit`

**Authentication**: API key via Authorization header (direct token or Bearer format)

**Response Structure**:

```typescript
{
  data: {
    limits: [{
      type: "TOKENS_LIMIT",
      percentage: number,      // 0-100
      currentValue?: number,   // Tokens used in 5-hour window
      usage?: number,          // Token limit (e.g., 800M)
    }]
  }
}
```

## Implementation Approach

### 1. Create GLM Usage Service (`apps/server/src/glmUsageService.ts`)

- Create a service class that fetches from Z.ai API
- Read API key from environment variable `GLM_API_KEY`
- Cache response with TTL (2 minutes)
- Handle authentication errors gracefully

### 2. Add WebSocket Event for Usage Data

- Server: Add new orchestration domain event type `glmUsageUpdated`
- Emit cached usage data when:
  - API fetch succeeds
  - Client subscribes
  - On interval (every 2 minutes)

### 3. Create Usage Display Component (`apps/web/src/components/GlmUsageIndicator.tsx`)

- Compact display: percentage + progress bar + current/limit tokens
- Only visible when selected provider is "Claude Code" (GLM models)
- Color coding: normal/neutral (<90%), reddish (90%+)
- Hover tooltip with percentage and token details
- Loading/error states
- Display next to ProviderModelPicker in chat header

### 4. Integrate into ChatView

- Place `GlmUsageIndicator` next to `ProviderModelPicker` in `ChatView.tsx`
- Integration point: around line 3596-3622 where ProviderModelPicker is rendered
- Wrap ProviderModelPicker and GlmUsageIndicator in a flex container
- Subscribe to `glmUsageUpdated` WebSocket events in component useEffect
- Auto-show/hide based on selected provider (only show for `provider === 'claude'`)

## Files to Create/Modify

### New Files:

- `apps/server/src/glmUsageService.ts` - API client and caching
- `apps/web/src/components/GlmUsageIndicator.tsx` - Usage display component
- `packages/contracts/src/glmUsage.ts` - Shared types for usage data

### Modified Files:

- `apps/server/src/wsServer.ts` - Add usage event subscription
- `apps/web/src/components/ChatView.tsx` - Add usage indicator component near ProviderModelPicker

## API Key Configuration

- Set via environment variable `GLM_API_KEY` on the server
- No UI configuration needed - server reads env var on startup

## Verification

1. Set `GLM_API_KEY` environment variable on server and restart
2. Select a GLM model (GLM-5, GLM-4.7, etc.)
3. Verify usage indicator appears next to model picker
4. Check percentage matches Z.ai dashboard
5. Verify auto-refresh works (wait 2+ minutes)
6. Test error states (invalid API key, network issues)
7. Verify indicator hides when selecting non-GLM models (Codex, Cursor)
8. Verify reddish color appears at 90%+ usage

## Dependencies

None - uses native `fetch` (Node.js 18+) on server, browser WebSocket on client.

If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at:
/home/vaultuser/.claude/projects/-mnt-md-extra-projects-t3code-clone-t3code/3aab87f1-af7d-4a9a-9cb0-dd42e76bb5ec.jsonl
