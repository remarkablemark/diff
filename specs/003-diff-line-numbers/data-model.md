# Data Model: Diff Line Numbers

**Feature**: 003-diff-line-numbers
**Date**: 2026-02-08

## New Types

### DiffLine

A single line of diff output with line number metadata.

```typescript
/** A single line in the diff output with line number metadata */
export interface DiffLine {
  /** The text content of this line (without trailing newline) */
  text: string;
  /** The diff classification: added, removed, or unchanged */
  type: DiffType;
  /** Line number in the original text, undefined for added lines */
  originalLineNumber: number | undefined;
  /** Line number in the modified text, undefined for removed lines */
  modifiedLineNumber: number | undefined;
}
```

### DiffLineResult

Extended diff result that includes line-based output alongside the existing segment-based output.

```typescript
/** Extended diff result with line-based output for rendering with line numbers */
export interface DiffLineResult extends DiffResult {
  /** Line-based representation of the diff, derived from segments */
  lines: DiffLine[];
}
```

## Modified Types

### DiffResult (unchanged)

The existing `DiffResult` interface is not modified. `DiffLineResult` extends it to maintain backward compatibility.

### DiffViewerProps (modified)

```typescript
export interface DiffViewerProps {
  /** The computed diff result with line data, null when output should be hidden */
  result: DiffLineResult | null;
  /** The effective display mode (forced 'unified' on mobile) */
  viewMode: ViewMode;
}
```

## Utility Functions

### segmentsToLines

Pure transformation function: `DiffSegment[] → DiffLine[]`

**Input**: `DiffSegment[]` — flat array of diff segments from `useDiff`
**Output**: `DiffLine[]` — one entry per output line with line numbers

**Algorithm**:

1. Track two counters: `originalLine` (starts at 1), `modifiedLine` (starts at 1)
2. For each segment, split `value` by `\n`
3. For each resulting sub-line (skip trailing empty from split):
   - Create `DiffLine` with appropriate line numbers based on type
   - Increment counters: `removed` → originalLine++, `added` → modifiedLine++, `unchanged` → both++
4. Return accumulated `DiffLine[]`

**Line number assignment rules**:

| Segment Type | originalLineNumber       | modifiedLineNumber       |
| ------------ | ------------------------ | ------------------------ |
| `unchanged`  | current original counter | current modified counter |
| `removed`    | current original counter | `undefined`              |
| `added`      | `undefined`              | current modified counter |

## Side-by-Side Pairing

For side-by-side rendering, `DiffLine[]` is mapped into paired rows:

```typescript
interface DiffRowPair {
  original: DiffLine | null;
  modified: DiffLine | null;
}
```

**Pairing rules**:

- `unchanged` line → appears in both `original` and `modified`
- `removed` line → `original` gets the line, `modified` gets `null` (placeholder)
- `added` line → `original` gets `null` (placeholder), `modified` gets the line

## localStorage Schema

No changes — this feature does not add any persisted state.
