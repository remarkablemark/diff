# Research: Diff Line Numbers

**Feature**: 003-diff-line-numbers
**Date**: 2026-02-08

## R1: Splitting DiffSegments into Lines

**Decision**: Implement a pure utility function `segmentsToLines` that iterates through `DiffSegment[]`, splits each segment's `value` by `\n`, and emits one `DiffLine` per output line with tracked original/modified line counters.

**Rationale**: The `diff` library returns segments as contiguous text chunks (e.g., `"line1\nline2\n"` as a single segment). To display line numbers, we must split these into discrete rows. A pure function is testable in isolation, memoizable, and keeps the hook layer thin.

**Algorithm**:

1. Initialize `originalLine = 1`, `modifiedLine = 1`
2. For each segment in `DiffSegment[]`:
   - Split `segment.value` by `\n`
   - For each sub-line (except trailing empty string from split):
     - Emit a `DiffLine` with:
       - `text`: the sub-line content
       - `type`: inherited from the segment
       - `originalLineNumber`: current counter if type is `removed` or `unchanged`, else `undefined`
       - `modifiedLineNumber`: current counter if type is `added` or `unchanged`, else `undefined`
     - Increment the appropriate counter(s)
   - Handle mid-segment newlines: when a segment contains `\n`, each split piece becomes its own `DiffLine`
3. Special case: if a segment ends with `\n`, the final split produces an empty string — skip it (it represents the newline itself, not a new line of content)

**Alternatives considered**:

- **Modify `useDiff` to return lines directly**: Rejected — mixes concerns. The hook computes diffs; line splitting is a presentation transformation.
- **Split in the component**: Rejected — duplicates logic between unified and side-by-side renderers.
- **Use `diffLines` exclusively**: Rejected — spec requires line numbers for all three diff methods.

## R2: DiffViewer Row-Based Rendering

**Decision**: Restructure `DiffViewer` from inline `<span>` elements to a table-like layout using `<div>` rows. Each row contains a gutter cell (line numbers) and a content cell (diff text with color coding).

**Rationale**: Line numbers require vertical alignment between the gutter and content. A row-based layout naturally enforces this. Using `<div>` with CSS grid or flexbox (via Tailwind) keeps the markup semantic and avoids `<table>` accessibility concerns.

**Unified view layout**:

```
[orig#] [mod#] | content
```

- Two narrow gutter columns (original, modified) on the left
- Content column fills remaining width
- Removed lines: orig# shown, mod# blank
- Added lines: orig# blank, mod# shown
- Unchanged lines: both shown

**Side-by-side view layout**:

```
[orig#] | original content    ||    [mod#] | modified content
```

- Each column has its own single gutter
- Placeholder rows (faint gray background, no line number) for lines that don't exist on that side

**Alternatives considered**:

- **HTML `<table>`**: Rejected — adds accessibility complexity (need `role` overrides), Tailwind styling is less ergonomic with tables.
- **CSS `display: table`**: Rejected — same issues as `<table>`, less flexible for responsive behavior.
- **Keep inline spans, add line numbers via CSS counters**: Rejected — CSS counters can't produce two independent counters (original + modified) that skip based on diff type.

## R3: Gutter Styling (Reuse TextInput Pattern)

**Decision**: Reuse the existing `TextInput` gutter Tailwind classes for the diff output gutter.

**Rationale**: Spec clarification Q2 explicitly requires visual consistency with `TextInput`.

**Existing TextInput gutter classes**:

- `bg-gray-50 dark:bg-gray-800` — light background strip
- `px-2 py-2` — padding
- `text-right` — right-aligned numbers
- `font-mono text-sm leading-6` — monospace, small, consistent line height
- `text-gray-400 dark:text-gray-500` — muted color
- `select-none` — not selectable
- `aria-hidden="true"` — hidden from screen readers

**Diff gutter adaptation**:

- Same base classes for each gutter column
- Unified view: two adjacent gutter columns, each with `min-w-[2ch]` to accommodate varying digit widths (FR-008)
- Side-by-side view: single gutter column per side

## R4: Side-by-Side Placeholder Rows

**Decision**: When a line exists only on one side (added or removed), the opposite column renders a placeholder row with a faint gray background (`bg-gray-100 dark:bg-gray-800`) and no line number.

**Rationale**: Spec clarification Q4 requires GitHub convention. This keeps rows aligned across columns so users can visually track corresponding lines.

**Implementation approach**:

- The `segmentsToLines` output is a flat array. For side-by-side rendering, the component pairs lines: unchanged lines appear in both columns, removed lines appear only in original (placeholder in modified), added lines appear only in modified (placeholder in original).
- A helper function or inline logic in the component maps `DiffLine[]` into paired rows: `{ original: DiffLine | null, modified: DiffLine | null }[]`.

**Alternatives considered**:

- **No placeholders (skip rows)**: Rejected — spec explicitly requires aligned rows.
- **Placeholder with line number showing "—"**: Rejected — GitHub convention shows empty gutter, not a dash.
