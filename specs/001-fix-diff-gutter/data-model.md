# Data Model: Fix Line Numbers in Diff Gutter

**Date**: 2026-03-03 | **Feature**: 001-fix-diff-gutter

## Core Entities

### DiffLine

A single line of diff output with line number metadata.

**Source**: `src/types/diff.ts`

```typescript
interface DiffLine {
  text: string;
  type: 'added' | 'removed' | 'unchanged';
  originalLineNumber?: number;
  modifiedLineNumber?: number;
}
```

**Fields**:

- `text`: The actual line content (without trailing newline)
- `type`: Diff classification determining visual styling
  - `'added'`: Line exists only in modified text
  - `'removed'`: Line exists only in original text
  - `'unchanged'`: Line exists in both texts
- `originalLineNumber`: 1-based index in original text (undefined if type is 'added')
- `modifiedLineNumber`: 1-based index in modified text (undefined if type is 'removed')

**Validation Rules**:

- Line numbers are 1-based (first line is 1, not 0)
- `originalLineNumber` MUST be undefined when `type === 'added'`
- `modifiedLineNumber` MUST be undefined when `type === 'removed'`
- Both line numbers MUST be present when `type === 'unchanged'`
- Line numbers MUST be sequential within each source text

**Usage**:

- Input to `LineNumberGutter` component via `lines` prop
- Rendered in `DiffViewer` component for both unified and side-by-side views

---

### DiffSegment (Input to segmentsToLines)

Flat segment from diff library before line-based transformation.

**Source**: `src/types/diff.ts`

```typescript
interface DiffSegment {
  value: string;
  type: 'added' | 'removed' | 'unchanged';
}
```

**Relationship to DiffLine**:

- `segmentsToLines()` transforms `DiffSegment[]` → `DiffLine[]`
- Each segment may contain multiple lines (split by `\n`)
- Segment type determines line number assignment logic

---

## Data Flow

```
┌─────────────────┐
│ diff library    │
│ (diff method)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ DiffSegment[]   │
│ (flat segments) │
└────────┬────────┘
         │
         ▼ segmentsToLines()
┌─────────────────┐
│ DiffLine[]      │
│ (line-based)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ DiffViewer      │
│ LineNumberGutter│
└─────────────────┘
```

---

## Component Contracts

### LineNumberGutter Props

**Source**: `src/components/LineNumberGutter/LineNumberGutter.types.ts`

```typescript
interface LineNumberGutterProps {
  lines: DiffLine[]; // NEW: Line data with metadata
  viewMode?: 'unified' | 'side-by-side'; // NEW: View context
  scrollTop: number; // Existing: Vertical scroll position
  scrollLeft: number; // Existing: Horizontal scroll position
  className?: string; // Existing: Additional CSS classes
  'aria-label'?: string; // Existing: Accessibility label
}
```

**Changes from current**:

- `lineCount` → replaced by `lines.length`
- `digitCount` → computed internally from `lines` array
- Added `lines` prop for line number data
- Added `viewMode` prop for rendering context

---

### DiffViewer Props

**Source**: `src/components/DiffViewer/DiffViewer.types.ts`

```typescript
interface DiffViewerProps {
  result: {
    lines: DiffLine[];
    hasChanges: boolean;
  } | null;
  viewMode: 'unified' | 'side-by-side';
  diffMethod?: 'characters' | 'words' | 'lines';
  enableScrollSync?: boolean;
  gutterWidth?: 'auto' | number;
  className?: string;
}
```

**No changes required**: Already uses `DiffLine[]` structure.

---

## State Transitions

N/A - This feature involves no state management. Data flows unidirectionally:

1. User inputs text
2. `useDiff` hook computes diff
3. `segmentsToLines` transforms to line-based format
4. Components render read-only diff output

---

## Type Safety Notes

- All interfaces use explicit types (no `any`)
- Optional fields use `?` modifier with undefined handling
- Union types for `type` field ensure exhaustive switch statements
- TypeScript strict mode enforced (no implicit any)
