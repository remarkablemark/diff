# Research: Query String State Persistence

**Feature**: 001-querystring-state  
**Date**: 2026-03-07  
**Status**: Complete

## Overview

This document captures research decisions for implementing URL query string-based state persistence in the diff tool. All technical unknowns from the planning phase have been resolved.

## Research Areas

### 1. URL Compression Strategy

**Decision**: Use lz-string library with `compressToEncodedURIComponent` method

**Rationale**:

- lz-string is specifically designed for URL compression with Base64-safe encoding
- `compressToEncodedURIComponent` produces URL-safe strings without additional encoding
- Widely adopted in similar tools (CodePen, JSFiddle, GitHub Gist)
- Small bundle size (~3KB minified)
- Excellent compression ratio for text data (typically 40-60% reduction)
- Synchronous API suitable for client-side use

**Alternatives Considered**:

- **pako (zlib)**: Larger bundle size (~45KB), overkill for this use case
- **LZW compression**: Not URL-safe without additional encoding, worse compression ratio
- **Base64 encoding only**: No compression, URLs would exceed limits quickly
- **Custom compression**: Reinventing the wheel, not justified for this feature

**Implementation Notes**:

```typescript
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

// Compress
const compressed = compressToEncodedURIComponent(originalText);

// Decompress (returns null on failure)
const decompressed = decompressFromEncodedURIComponent(compressed);
```

### 2. Debouncing Implementation

**Decision**: Use custom debounce utility with 500ms delay (configurable)

**Rationale**:

- React 19 with React Compiler handles optimization automatically
- No need for `useMemo` or `useCallback` (compiler optimizes)
- Custom utility provides full control and testability
- 500ms is industry standard for text input debouncing
- Avoids external dependency (lodash.debounce)

**Alternatives Considered**:

- **lodash.debounce**: Adds 2KB+ dependency for single function
- **use-debounce library**: Unnecessary abstraction, adds dependency
- **setTimeout directly in component**: Harder to test, cleanup issues
- **Throttling instead**: Less user-friendly (updates during typing)

**Implementation Notes**:

```typescript
// src/utils/debounce.ts
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```

### 3. History API Strategy

**Decision**: Use `window.history.replaceState` for all URL updates

**Rationale**:

- Prevents browser history pollution (users don't need to click back 50 times)
- Standard pattern for auto-saving applications (Google Docs, Figma)
- Maintains clean navigation UX
- Still supports browser back/forward for intentional page navigations
- No performance overhead compared to `pushState`

**Alternatives Considered**:

- **pushState for every change**: Creates unusable browser history
- **Hybrid approach** (replaceState during typing, pushState on method change): Added complexity without clear benefit
- **No history modification**: Requires page reload to see URL changes

**Implementation Notes**:

```typescript
const updateURL = (params: URLSearchParams) => {
  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, '', newURL);
};
```

### 4. URL Parameter Precedence

**Decision**: URL parameters override localStorage on page load

**Rationale**:

- Ensures shared URLs always restore exact state (primary use case)
- Predictable behavior: URL is "source of truth" for shared links
- localStorage serves as fallback for default preferences only
- Aligns with user expectations (clicking a link should show what was shared)

**Alternatives Considered**:

- **localStorage takes precedence**: Breaks sharing use case
- **Merge strategies**: Complex, unpredictable behavior
- **No localStorage integration**: Loses user preferences between sessions

**Implementation Notes**:

```typescript
// Load order:
// 1. Check URL params first
// 2. Fall back to localStorage if param missing
// 3. Use hardcoded default if neither exists

const method =
  urlParams.get('method') ?? localStorage.getItem('diff.method') ?? 'words';
```

### 5. URL Length Handling

**Decision**: Show warning toast when compressed URL exceeds 2000 characters

**Rationale**:

- 2000 chars is safe limit across all browsers (IE11: 2083, others: 8000+)
- Warning allows user to continue (some browsers support longer URLs)
- Non-blocking UX (feature still works, just warns about compatibility)
- Compression typically keeps URLs under limit for reasonable diff sizes

**Alternatives Considered**:

- **Hard block at limit**: Too restrictive, some browsers support longer URLs
- **Automatic fallback to localStorage**: Breaks sharing use case
- **Truncate silently**: Data loss without user awareness
- **No limit checking**: Poor UX when URLs fail silently

**Implementation Notes**:

```typescript
const MAX_URL_LENGTH = 2000;

if (newURL.length > MAX_URL_LENGTH) {
  showWarning('URL may be too long for some browsers');
}
```

### 6. Error Handling Strategy

**Decision**: Graceful degradation with default values

**Rationale**:

- Invalid/corrupted URLs should not break the application
- Users can manually edit URLs - must handle malformed input
- Decompression failures should fall back to empty state
- Invalid enum values (method/view) should use defaults

**Alternatives Considered**:

- **Throw errors on invalid input**: Breaks user experience
- **Redirect to clean URL**: Loses user context
- **Show error modal**: Interrupts workflow unnecessarily

**Implementation Notes**:

```typescript
// Decompression with fallback
const decompressed = decompressFromEncodedURIComponent(compressed) ?? '';

// Enum validation with default
const method = ['characters', 'words', 'lines'].includes(urlMethod)
  ? urlMethod
  : 'words';
```

### 7. Testing Strategy

**Decision**: Unit tests for utilities, integration tests for hook, E2E tests for App component

**Test Coverage Plan**:

**Compression utilities** (`compression.test.ts`):

- Compress/decompress round-trip
- Handle empty strings
- Handle special characters (unicode, emoji)
- Handle null/undefined input
- Handle corrupted compressed data

**Query string utilities** (`queryString.test.ts`):

- Encode/decode all parameter types
- Handle missing parameters
- Handle invalid parameter values
- Preserve existing query params
- URL encoding edge cases

**Debounce utility** (`debounce.test.ts`):

- Delays function execution
- Cancels pending calls on new input
- Executes with correct arguments
- Cleanup on unmount

**useQueryState hook** (`useQueryState.test.ts`):

- Reads initial state from URL
- Falls back to localStorage
- Updates URL on state change (debounced)
- Uses replaceState not pushState
- Handles popstate events (back/forward)

**App component** (`App.test.tsx` updates):

- URL updates when text changes (debounced)
- URL updates when method changes
- URL updates when view changes
- State restores from URL on mount
- URL params override localStorage
- Invalid URLs fall back to defaults
- Warning shown for long URLs

**Rationale**: 100% coverage required by constitution. Layered testing ensures all edge cases covered.

## Dependencies

### New Runtime Dependencies

| Package   | Version | Size | Justification                                        |
| --------- | ------- | ---- | ---------------------------------------------------- |
| lz-string | ^1.5.0  | ~3KB | URL compression, industry standard for this use case |

### New Dev Dependencies

None required - all testing infrastructure already in place.

## Performance Considerations

**URL Update Performance**:

- Debounce delay: 500ms (configurable)
- Compression: <10ms for typical diff sizes (<10KB text)
- History API: <1ms (synchronous)
- Total latency: ~500ms after user stops typing ✅ Meets SC-002

**Page Load Performance**:

- URL parsing: <1ms
- Decompression: <10ms for typical sizes
- State restoration: <1ms
- Total: <20ms ✅ Meets <100ms goal

**Bundle Size Impact**:

- lz-string: ~3KB minified
- Custom utilities: ~1KB
- Total addition: ~4KB ✅ Minimal impact

## Security Considerations

**No security risks identified**:

- All processing is client-side
- No data sent to servers
- No XSS risk (URL params are not rendered as HTML)
- No CSRF risk (no server mutations)
- Compression library is well-established and audited

## Browser Compatibility

**Target browsers** (per existing project):

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

**Required APIs**:

- URLSearchParams ✅ (supported in all target browsers)
- History API (replaceState) ✅ (supported in all target browsers)
- localStorage ✅ (supported in all target browsers)

## Open Questions

None - all research complete.

## References

- [lz-string documentation](https://pieroxy.net/blog/pages/lz-string/index.html)
- [History API MDN](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [URLSearchParams MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- [URL length limits](https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers)
