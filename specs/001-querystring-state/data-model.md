# Data Model: Query String State Persistence

**Feature**: 001-querystring-state  
**Date**: 2026-03-07  
**Status**: Complete

## Overview

This feature introduces URL query string-based state persistence. The data model is minimal as all state is ephemeral (stored in URL and browser memory only). No persistent storage or backend is involved.

## Entities

### QueryState

Represents the application state that can be serialized to/from URL query parameters.

**TypeScript Definition**:

```typescript
interface QueryState {
  /** Left-side diff text (original) */
  original: string;

  /** Right-side diff text (modified) */
  modified: string;

  /** Comparison algorithm selection */
  method: DiffMethod;

  /** Display mode/layout option */
  view: ViewMode;
}
```

**Field Details**:

| Field      | Type         | Required | Default     | Validation                                           |
| ---------- | ------------ | -------- | ----------- | ---------------------------------------------------- |
| `original` | `string`     | No       | `""`        | Any string (compressed in URL)                       |
| `modified` | `string`     | No       | `""`        | Any string (compressed in URL)                       |
| `method`   | `DiffMethod` | No       | `"words"`   | Must be one of: `"characters"`, `"words"`, `"lines"` |
| `view`     | `ViewMode`   | No       | `"unified"` | Must be one of: `"unified"`, `"side-by-side"`        |

**Relationships**: None (flat structure)

**State Transitions**: None (stateless, each URL load is independent)

### DiffMethod (Existing Type)

Enum representing available comparison algorithms.

**TypeScript Definition**:

```typescript
type DiffMethod = 'characters' | 'words' | 'lines';
```

**Values**:

- `'characters'`: Character-by-character diff
- `'words'`: Word-by-word diff (default)
- `'lines'`: Line-by-line diff

### ViewMode (Existing Type)

Enum representing available display modes.

**TypeScript Definition**:

```typescript
type ViewMode = 'unified' | 'side-by-side';
```

**Values**:

- `'unified'`: Single column view (default)
- `'side-by-side'`: Two column view

## URL Encoding Schema

### Query Parameter Mapping

| Parameter  | QueryState Field | Encoding                 | Compression |
| ---------- | ---------------- | ------------------------ | ----------- |
| `original` | `original`       | lz-string + URL encoding | Yes         |
| `modified` | `modified`       | lz-string + URL encoding | Yes         |
| `method`   | `method`         | Plain text               | No          |
| `view`     | `view`           | Plain text               | No          |

### URL Format

```
https://example.com/?original={compressed}&modified={compressed}&method={value}&view={value}
```

**Example URLs**:

```
# Empty state (no parameters)
https://example.com/

# Simple diff
https://example.com/?original=BYUwNmD2Q&modified=BYUwNmD2A&method=words&view=unified

# Only method specified (texts empty)
https://example.com/?method=characters

# Full state
https://example.com/?original=N4IgdghgtgpiBcIDKBXALgAgM4gL5A&modified=N4IgdghgtgpiBcIDKBXALgAgM4gL5B&method=lines&view=side-by-side
```

### Compression Details

**Algorithm**: lz-string `compressToEncodedURIComponent`

**Characteristics**:

- Base64-safe encoding (URL-safe without additional encoding)
- Typical compression ratio: 40-60% for text data
- Synchronous compression/decompression
- Returns `null` on decompression failure

**Example**:

```typescript
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

// Compress
const original = 'hello world';
const compressed = compressToEncodedURIComponent(original);
// Result: "BYUwNmD2Q4A"

// Decompress
const decompressed = decompressFromEncodedURIComponent(compressed);
// Result: "hello world" or null if corrupted
```

## Validation Rules

### Field Validation

**original** (string):

- No length limit (browser URL limits apply)
- Empty string is valid
- Special characters allowed (unicode, emoji, etc.)
- Compressed before URL encoding

**modified** (string):

- Same rules as `original`

**method** (DiffMethod):

- Must be one of: `"characters"`, `"words"`, `"lines"`
- Invalid values fall back to `"words"`
- Case-sensitive

**view** (ViewMode):

- Must be one of: `"unified"`, `"side-by-side"`
- Invalid values fall back to `"unified"`
- Case-sensitive

### URL Validation

**Length limits**:

- Warning threshold: 2000 characters (safe across all browsers)
- No hard limit enforced (some browsers support 8000+ chars)

**Malformed URLs**:

- Missing parameters → use defaults
- Corrupted compression → use empty string
- Invalid enum values → use defaults
- Extra parameters → ignored

## Data Flow

### Save Flow (State → URL)

```
User Input
    ↓
State Change (original/modified/method/view)
    ↓
Debounce (500ms)
    ↓
Compress original/modified (lz-string)
    ↓
Build URLSearchParams
    ↓
Check URL length (warn if >2000 chars)
    ↓
Update URL (replaceState)
```

### Load Flow (URL → State)

```
Page Load / URL Change
    ↓
Parse URLSearchParams
    ↓
Extract query parameters
    ↓
Decompress original/modified (lz-string)
    ↓
Validate method/view enums
    ↓
Fall back to localStorage for missing params
    ↓
Fall back to defaults if still missing
    ↓
Set application state
```

### Precedence Order

For each field:

1. URL query parameter (if present and valid)
2. localStorage value (if URL param missing)
3. Hardcoded default (if both missing)

**Example**:

```typescript
const method =
  validateMethod(urlParams.get('method')) ?? // 1. URL
  validateMethod(localStorage.getItem('diff.method')) ?? // 2. localStorage
  'words'; // 3. Default
```

## Edge Cases

### Empty State

- No query parameters → all fields use defaults
- Application functions normally with empty inputs

### Partial State

- Some parameters present → use provided values, defaults for missing
- Example: `?method=lines` → method='lines', original='', modified='', view='unified'

### Corrupted Data

- Decompression fails → use empty string for that field
- Invalid enum → use default value
- Application remains functional

### URL Length Exceeded

- Show warning toast to user
- URL still updated (may work in some browsers)
- Feature continues to function

### Special Characters

- Unicode, emoji, newlines → handled by compression
- URL-unsafe characters → handled by lz-string encoding
- No manual escaping needed

## Performance Characteristics

### Compression Performance

- Small texts (<1KB): <1ms
- Medium texts (1-10KB): <10ms
- Large texts (10-100KB): <50ms

### Decompression Performance

- Small texts (<1KB): <1ms
- Medium texts (1-10KB): <5ms
- Large texts (10-100KB): <20ms

### Memory Usage

- Compressed strings stored in URL (browser manages)
- Decompressed strings in React state (garbage collected)
- No persistent storage overhead

## Testing Considerations

### Test Data Sets

**Valid inputs**:

- Empty strings
- Single character
- ASCII text
- Unicode text (accented characters)
- Emoji
- Multi-line text
- Very long text (>10KB)

**Invalid inputs**:

- `null` / `undefined`
- Corrupted compressed strings
- Invalid enum values
- Malformed URLs

### Boundary Conditions

- URL length at 2000 chars (warning threshold)
- URL length at 8000 chars (browser limit)
- Empty state (no parameters)
- Partial state (some parameters missing)

## Future Considerations

**Not in scope for this feature**:

- URL shortening service integration
- Server-side state storage
- State versioning / migration
- Sharing via QR codes
- State history / undo functionality

These may be considered in future iterations if user demand exists.
