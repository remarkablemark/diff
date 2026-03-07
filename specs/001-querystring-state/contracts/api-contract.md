# API Contract: Query String State Persistence

**Feature**: 001-querystring-state  
**Date**: 2026-03-07  
**Type**: Client-Side Browser APIs

## Overview

This feature uses browser-native APIs only. No REST/GraphQL endpoints are involved. This document defines the contracts for browser API interactions and internal utility functions.

## Browser API Contracts

### History API

**Method**: `window.history.replaceState()`

**Purpose**: Update URL without page reload or history pollution

**Contract**:

```typescript
window.history.replaceState(
  state: any,           // Always null for this feature
  unused: string,       // Always empty string
  url?: string | URL    // New URL with query parameters
): void
```

**Usage**:

```typescript
const newURL = `${window.location.pathname}?${params.toString()}`;
window.history.replaceState(null, '', newURL);
```

**Guarantees**:

- URL updates immediately
- No page reload triggered
- No popstate event fired
- Browser back/forward still functional

---

### URLSearchParams API

**Purpose**: Parse and construct query strings

**Contract**:

```typescript
// Constructor
new URLSearchParams(init?: string | URLSearchParams): URLSearchParams

// Methods used
.get(name: string): string | null
.set(name: string, value: string): void
.toString(): string
```

**Usage**:

```typescript
// Parse current URL
const params = new URLSearchParams(window.location.search);
const method = params.get('method');

// Build new URL
const newParams = new URLSearchParams();
newParams.set('original', compressedOriginal);
newParams.set('method', 'words');
const queryString = newParams.toString();
```

**Guarantees**:

- Proper URL encoding/decoding
- Handles special characters
- Returns null for missing parameters

---

### localStorage API

**Purpose**: Fallback storage for default preferences

**Contract**:

```typescript
localStorage.getItem(key: string): string | null
localStorage.setItem(key: string, value: string): void
```

**Keys Used**:

- `diff.diffMethod`: Stores DiffMethod preference
- `diff.viewMode`: Stores ViewMode preference

**Usage**:

```typescript
// Read (with JSON parsing)
const stored = localStorage.getItem('diff.diffMethod');
const method = stored ? JSON.parse(stored) : 'words';

// Write (with JSON serialization)
localStorage.setItem('diff.diffMethod', JSON.stringify('lines'));
```

**Guarantees**:

- Synchronous operations
- Persists across sessions
- Returns null if key doesn't exist

## Internal Utility Contracts

### Compression Utilities

**Module**: `src/utils/compression.ts`

#### `compressText(text: string): string`

**Purpose**: Compress text for URL storage

**Contract**:

```typescript
function compressText(text: string): string;
```

**Input**:

- `text`: Any string (may be empty)

**Output**:

- URL-safe compressed string
- Empty string returns empty string

**Guarantees**:

- Always returns a string (never null/undefined)
- Output is URL-safe (no additional encoding needed)
- Deterministic (same input → same output)

**Example**:

```typescript
compressText('hello world'); // → 'BYUwNmD2Q4A'
compressText(''); // → ''
```

---

#### `decompressText(compressed: string): string`

**Purpose**: Decompress text from URL

**Contract**:

```typescript
function decompressText(compressed: string): string;
```

**Input**:

- `compressed`: URL-safe compressed string

**Output**:

- Decompressed original text
- Empty string if decompression fails
- Empty string if input is empty

**Guarantees**:

- Always returns a string (never null/undefined)
- Graceful failure (returns empty string on error)
- Round-trip safe: `decompressText(compressText(x)) === x`

**Example**:

```typescript
decompressText('BYUwNmD2Q4A'); // → 'hello world'
decompressText('corrupted!!!'); // → ''
decompressText(''); // → ''
```

---

### Query String Utilities

**Module**: `src/utils/queryString.ts`

#### `encodeQueryState(state: QueryState): URLSearchParams`

**Purpose**: Convert QueryState to URLSearchParams

**Contract**:

```typescript
interface QueryState {
  original: string;
  modified: string;
  method: DiffMethod;
  view: ViewMode;
}

function encodeQueryState(state: QueryState): URLSearchParams;
```

**Input**:

- `state`: Complete QueryState object

**Output**:

- URLSearchParams with all fields encoded
- Text fields compressed
- Enum fields as plain text

**Guarantees**:

- All fields included (even if empty)
- Compression applied to original/modified
- No additional URL encoding needed (URLSearchParams handles it)

**Example**:

```typescript
encodeQueryState({
  original: 'hello',
  modified: 'world',
  method: 'words',
  view: 'unified',
});
// → URLSearchParams with:
//   original=<compressed>
//   modified=<compressed>
//   method=words
//   view=unified
```

---

#### `decodeQueryState(params: URLSearchParams, fallback: Partial<QueryState>): QueryState`

**Purpose**: Parse URLSearchParams to QueryState

**Contract**:

```typescript
function decodeQueryState(
  params: URLSearchParams,
  fallback: Partial<QueryState>,
): QueryState;
```

**Input**:

- `params`: URLSearchParams from current URL
- `fallback`: Default values for missing/invalid parameters

**Output**:

- Complete QueryState object
- Missing parameters use fallback values
- Invalid enum values use fallback values
- Corrupted compression returns empty string

**Guarantees**:

- Always returns complete QueryState (all fields present)
- Never throws errors
- Graceful degradation for invalid input

**Example**:

```typescript
const params = new URLSearchParams('?method=lines');
decodeQueryState(params, {
  original: '',
  modified: '',
  method: 'words',
  view: 'unified',
});
// → {
//   original: '',
//   modified: '',
//   method: 'lines',
//   view: 'unified'
// }
```

---

### Debounce Utility

**Module**: `src/utils/debounce.ts`

#### `debounce<T>(fn: T, delay: number): T`

**Purpose**: Delay function execution until after delay period of inactivity

**Contract**:

```typescript
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void;
```

**Input**:

- `fn`: Function to debounce
- `delay`: Delay in milliseconds

**Output**:

- Debounced version of function
- Preserves function signature

**Guarantees**:

- Function executes only after `delay` ms of no new calls
- Previous pending calls are cancelled
- Arguments from latest call are used
- Cleanup handled automatically

**Example**:

```typescript
const updateURL = debounce((text: string) => {
  console.log('Update:', text);
}, 500);

updateURL('a'); // Scheduled
updateURL('ab'); // Previous cancelled, new scheduled
updateURL('abc'); // Previous cancelled, new scheduled
// After 500ms of no calls: logs 'Update: abc'
```

---

## React Hook Contract

### useQueryState Hook

**Module**: `src/hooks/useQueryState.ts`

**Purpose**: Manage URL query state with React

**Contract**:

```typescript
function useQueryState(): {
  queryState: QueryState;
  updateQueryState: (updates: Partial<QueryState>) => void;
};
```

**Return Value**:

- `queryState`: Current state from URL (or defaults)
- `updateQueryState`: Function to update state (debounced)

**Behavior**:

- Reads initial state from URL on mount
- Falls back to localStorage for missing params
- Updates URL when state changes (debounced 500ms)
- Uses `replaceState` (no history pollution)
- Listens to popstate events (back/forward navigation)

**Example**:

```typescript
function App() {
  const { queryState, updateQueryState } = useQueryState();

  // Read state
  console.log(queryState.method); // 'words'

  // Update state (URL updates after 500ms)
  updateQueryState({ method: 'lines' });
}
```

**Guarantees**:

- State always reflects URL (or defaults)
- Updates are debounced (prevents excessive URL changes)
- Back/forward navigation updates state correctly
- No memory leaks (cleanup on unmount)

---

## Error Handling Contracts

### Compression Errors

**Scenario**: Decompression fails (corrupted data)

**Behavior**:

- `decompressText()` returns empty string
- Application continues with empty text field
- No error thrown, no user notification

---

### Invalid Enum Values

**Scenario**: URL contains invalid method/view value

**Behavior**:

- Invalid value ignored
- Fallback to localStorage value
- If localStorage also invalid, use hardcoded default
- No error thrown, no user notification

---

### URL Length Exceeded

**Scenario**: Compressed URL exceeds 2000 characters

**Behavior**:

- URL still updated (may work in some browsers)
- Warning toast shown to user
- Application continues to function
- No data loss

---

### Missing Parameters

**Scenario**: URL has no query parameters

**Behavior**:

- All fields use fallback values (localStorage or defaults)
- Application functions normally
- No error thrown

---

## Type Definitions

### Complete TypeScript Contracts

```typescript
// src/types/diff.ts additions
export interface QueryState {
  original: string;
  modified: string;
  method: DiffMethod;
  view: ViewMode;
}

// src/utils/compression.ts
export function compressText(text: string): string;
export function decompressText(compressed: string): string;

// src/utils/queryString.ts
export function encodeQueryState(state: QueryState): URLSearchParams;
export function decodeQueryState(
  params: URLSearchParams,
  fallback: Partial<QueryState>,
): QueryState;

// src/utils/debounce.ts
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void;

// src/hooks/useQueryState.ts
export function useQueryState(): {
  queryState: QueryState;
  updateQueryState: (updates: Partial<QueryState>) => void;
};
```

---

## Testing Contracts

Each utility/hook must have tests covering:

**Compression**:

- ✅ Round-trip (compress → decompress)
- ✅ Empty string handling
- ✅ Special characters (unicode, emoji)
- ✅ Corrupted input handling

**Query String**:

- ✅ Encode all fields
- ✅ Decode all fields
- ✅ Missing parameter fallback
- ✅ Invalid enum fallback

**Debounce**:

- ✅ Delays execution
- ✅ Cancels pending calls
- ✅ Preserves arguments
- ✅ Cleanup on unmount

**Hook**:

- ✅ Reads from URL on mount
- ✅ Falls back to localStorage
- ✅ Updates URL (debounced)
- ✅ Handles popstate events
- ✅ Uses replaceState

**Integration**:

- ✅ App component URL sync
- ✅ State restoration from URL
- ✅ URL precedence over localStorage
- ✅ Warning for long URLs

---

## Performance Contracts

**URL Update Latency**:

- Target: 300-500ms after last user input
- Measured: Time from state change to URL update
- Acceptable: 200-600ms

**Decompression Latency**:

- Target: <100ms on page load
- Measured: Time from URL parse to state ready
- Acceptable: <150ms for typical sizes

**Bundle Size Impact**:

- Target: <5KB addition
- Measured: lz-string + utilities minified
- Acceptable: <10KB

---

## Browser Compatibility Contracts

**Required APIs** (must work in all target browsers):

- ✅ URLSearchParams
- ✅ History API (replaceState)
- ✅ localStorage
- ✅ JSON.parse/stringify

**Target Browsers**:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

All APIs supported in these versions.
