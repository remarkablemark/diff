# Quickstart: Query String State Persistence

**Feature**: 001-querystring-state  
**Date**: 2026-03-07  
**Estimated Effort**: 4-6 hours

## Overview

Add URL query string-based state persistence to enable sharing and bookmarking diff configurations. Users can copy URLs to share exact diff states with others.

## Prerequisites

- Node.js 24 (per `.nvmrc`)
- Existing diff application running
- Familiarity with React hooks and TypeScript

## Quick Setup

### 1. Install Dependencies

```bash
npm install lz-string
npm install --save-dev @types/lz-string
```

### 2. Implementation Order

Follow this sequence for TDD compliance:

1. **Compression utilities** (`src/utils/compression.ts`)
2. **Query string utilities** (`src/utils/queryString.ts`)
3. **Debounce utility** (`src/utils/debounce.ts`)
4. **useQueryState hook** (`src/hooks/useQueryState.ts`)
5. **App component integration** (`src/components/App/App.tsx`)

### 3. Run Tests

After each implementation step:

```bash
# Run tests with coverage
npm run test:ci

# Run specific test file
npm run test:ci -- src/utils/compression.test.ts
```

### 4. Verify Functionality

```bash
# Start dev server
npm start

# Test in browser:
# 1. Enter text in both fields
# 2. Check URL updates after ~500ms
# 3. Copy URL
# 4. Open in new tab
# 5. Verify state restored
```

## Implementation Checklist

### Phase 1: Utilities (2-3 hours)

- [ ] Create `src/utils/compression.ts`
  - [ ] Write tests first (`compression.test.ts`)
  - [ ] Implement `compressText()`
  - [ ] Implement `decompressText()`
  - [ ] Verify 100% coverage

- [ ] Create `src/utils/queryString.ts`
  - [ ] Write tests first (`queryString.test.ts`)
  - [ ] Implement `encodeQueryState()`
  - [ ] Implement `decodeQueryState()`
  - [ ] Verify 100% coverage

- [ ] Create `src/utils/debounce.ts`
  - [ ] Write tests first (`debounce.test.ts`)
  - [ ] Implement `debounce()`
  - [ ] Verify 100% coverage

### Phase 2: Hook (1-2 hours)

- [ ] Create `src/hooks/useQueryState.ts`
  - [ ] Write tests first (`useQueryState.test.ts`)
  - [ ] Implement hook logic
  - [ ] Handle URL reading on mount
  - [ ] Handle localStorage fallback
  - [ ] Handle debounced URL updates
  - [ ] Handle popstate events
  - [ ] Verify 100% coverage

### Phase 3: Integration (1 hour)

- [ ] Update `src/components/App/App.tsx`
  - [ ] Add tests to `App.test.tsx`
  - [ ] Import `useQueryState` hook
  - [ ] Replace local state with query state
  - [ ] Verify URL updates on changes
  - [ ] Verify state restoration from URL
  - [ ] Verify 100% coverage

### Phase 4: Polish (30 mins)

- [ ] Add URL length warning
  - [ ] Test with very long text
  - [ ] Verify warning appears at 2000 chars
  - [ ] Verify URL still updates

- [ ] Update types if needed
  - [ ] Add `QueryState` interface to `src/types/diff.ts`

## Code Snippets

### Compression Utility Template

```typescript
// src/utils/compression.ts
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

export function compressText(text: string): string {
  if (!text) return '';
  return compressToEncodedURIComponent(text);
}

export function decompressText(compressed: string): string {
  if (!compressed) return '';
  const result = decompressFromEncodedURIComponent(compressed);
  return result ?? '';
}
```

### Hook Usage Template

```typescript
// src/components/App/App.tsx
import { useQueryState } from 'src/hooks/useQueryState';

export function App() {
  const { queryState, updateQueryState } = useQueryState();

  // Use queryState instead of local state
  const handleOriginalChange = (text: string) => {
    updateQueryState({ original: text });
  };

  // ... rest of component
}
```

## Testing Strategy

### Unit Tests

Each utility must test:

- Happy path
- Empty input
- Invalid input
- Edge cases (special characters, unicode, etc.)

### Integration Tests

Hook must test:

- Initial state from URL
- Fallback to localStorage
- Debounced updates
- popstate handling

### E2E Tests

App component must test:

- URL updates on text change
- URL updates on method change
- URL updates on view change
- State restoration from URL
- URL precedence over localStorage

## Common Issues

### Issue: Tests fail with "localStorage is not defined"

**Solution**: Vitest config already includes jsdom environment. Verify `vite.config.mts` has:

```typescript
test: {
  environment: 'jsdom',
  globals: true,
}
```

### Issue: URL doesn't update

**Solution**: Check debounce delay. Wait 500ms after last change. Use `vi.useFakeTimers()` in tests.

### Issue: Decompression returns null

**Solution**: Check input is valid compressed string. `decompressText()` should return empty string, not null.

### Issue: Coverage below 100%

**Solution**: Check for:

- Uncovered error paths
- Missing edge case tests
- Barrel exports (don't test `index.ts` files)

## Verification Steps

### Manual Testing

1. **Basic Flow**:
   - Enter text in both fields
   - Wait 500ms
   - Check URL contains `original` and `modified` parameters
   - Copy URL
   - Open in new tab
   - Verify text restored

2. **Method/View Changes**:
   - Change diff method
   - Check URL updates immediately
   - Change view mode
   - Check URL updates immediately

3. **Edge Cases**:
   - Enter very long text (>10KB)
   - Check for warning message
   - Enter unicode/emoji
   - Verify compression works
   - Manually edit URL to invalid values
   - Verify graceful fallback

### Automated Testing

```bash
# Full test suite
npm run test:ci

# Lint check
npm run lint

# Type check
npm run lint:tsc

# Build check
npm run build
```

All must pass before merge.

## Performance Validation

### URL Update Timing

```typescript
// In browser console
let start = Date.now();
// Type in textarea
// After URL updates:
console.log('Latency:', Date.now() - start, 'ms');
// Should be ~500ms
```

### Decompression Timing

```typescript
// In browser console
performance.mark('start');
// Navigate to URL with state
performance.mark('end');
performance.measure('load', 'start', 'end');
console.log(performance.getEntriesByName('load')[0].duration);
// Should be <100ms
```

## Rollback Plan

If issues arise:

1. **Revert App.tsx changes** - restore local state
2. **Remove new utilities** - delete files
3. **Uninstall lz-string** - `npm uninstall lz-string`
4. **Restore tests** - git checkout previous version

Feature is additive - rollback is clean.

## Next Steps

After implementation:

1. **Create tasks** - Run `/speckit.tasks` to generate task breakdown
2. **Implement** - Follow TDD workflow (test first, then code)
3. **Review** - Verify all constitution checks pass
4. **Merge** - PR to main branch

## Resources

- [lz-string documentation](https://pieroxy.net/blog/pages/lz-string/index.html)
- [History API MDN](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [URLSearchParams MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Support

For questions or issues:

- Review `specs/001-querystring-state/spec.md` for requirements
- Review `specs/001-querystring-state/research.md` for technical decisions
- Review `specs/001-querystring-state/data-model.md` for data structures
- Review `specs/001-querystring-state/contracts/api-contract.md` for API details
