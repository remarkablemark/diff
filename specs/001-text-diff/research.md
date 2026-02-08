# Research: Text Diff Checker

**Feature Branch**: `001-text-diff`
**Date**: 2026-02-07

## Research Topic 1: `diff` Library (npm: diff / jsdiff)

### Decision

Use the `diff` npm package (jsdiff) with `diffWords()` as the primary diff function.

### Rationale

- **Established library**: jsdiff is the most widely used JavaScript diff library (~40M weekly downloads)
- **Small footprint**: ~10KB minified, aligns with the Simplicity & Performance constitution principle
- **Built-in TypeScript types**: Since v8, ships with its own type definitions — no `@types/diff` needed
- **Word-level diffing**: `diffWords()` matches spec requirement FR-002 for word-level granularity
- **Pure JavaScript**: Runs entirely client-side, no server dependency — aligns with Client-Side Only principle

### API Surface (relevant subset)

- **`diffWords(oldStr, newStr)`**: Returns `Change[]` where each `Change` has:
  - `value: string` — the text content of this segment
  - `added?: boolean` — true if this segment was added in the new text
  - `removed?: boolean` — true if this segment was removed from the old text
  - If neither `added` nor `removed` is true, the segment is unchanged
  - `count?: number` — number of tokens in this segment
- **`diffLines(oldStr, newStr)`**: Alternative for line-level diffing (not used per spec, but available for future enhancement)
- **`diffChars(oldStr, newStr)`**: Character-level alternative (too granular per spec clarification)

### Alternatives Considered

| Library                       | Rejected Because                                                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `fast-diff`                   | Returns tuple arrays instead of objects; less ergonomic for React rendering; smaller community                         |
| `text-diff`                   | Last published 10 years ago; no TypeScript types; uses HTML output (conflicts with custom React rendering requirement) |
| `react-diff-viewer-continued` | External diff rendering library — spec explicitly requires custom React components (FR-003)                            |
| Custom implementation         | Violates Simplicity principle; Myers diff algorithm is non-trivial to implement and test correctly                     |

---

## Research Topic 2: Line Number Gutter for `<textarea>`

### Decision

Implement a custom line number gutter using a `<div>` alongside each `<textarea>`, with scroll synchronization via the `onScroll` event.

### Rationale

- **No external editor dependency**: Spec clarification explicitly states "No external editor library"
- **Simple implementation**: A numbered `<div>` that mirrors the textarea's scroll position
- **Accessible**: The gutter is decorative (not interactive), so it needs `aria-hidden="true"` to avoid confusing screen readers
- **Tailwind-friendly**: Monospace font matching and line-height alignment via utility classes

### Implementation Approach

1. Render a `<div>` with line numbers (1 to N) next to each `<textarea>`
2. Sync the gutter's `scrollTop` with the textarea's `scrollTop` on the textarea's `scroll` event
3. Recalculate line count on every content change
4. Use `overflow: hidden` on the gutter to prevent independent scrolling

### Alternatives Considered

| Approach                | Rejected Because                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| CodeMirror / Monaco     | External editor libraries — explicitly excluded by spec                                        |
| CSS `counter-increment` | Cannot sync scroll position with textarea; breaks on long content                              |
| `contenteditable` div   | Accessibility nightmare; inconsistent behavior across browsers; loses native textarea features |

---

## Research Topic 3: Unified vs Side-by-Side Diff Views

### Decision

Implement both views as separate rendering modes within the `DiffViewer` component, controlled by a `ViewMode` state toggled via `ViewToggle`.

### Rationale

- **Unified inline view**: Single column, interleaved additions/deletions — compact, good for small diffs
- **Side-by-side view**: Two columns with aligned content — better for comparing large blocks
- **Toggle pattern**: Simple `useState<ViewMode>` with a button group — no routing or complex state needed

### Implementation Approach

#### Unified View

- Render `Change[]` from `diffWords()` sequentially in a single `<pre>` or `<div>`
- Apply `bg-red-100 text-red-800` for removed, `bg-green-100 text-green-800` for added
- Prefix removed segments with `-` and added segments with `+` (accessibility: not color-only)

#### Side-by-Side View

- Split `Change[]` into left (original) and right (modified) columns
- Left column shows removed + unchanged segments; right column shows added + unchanged segments
- Align rows so corresponding changes appear at the same vertical position

### Alternatives Considered

| Approach                            | Rejected Because                                                       |
| ----------------------------------- | ---------------------------------------------------------------------- |
| Tab-based switching                 | Toggle button is simpler and more discoverable for a two-option choice |
| Three views (unified + split + raw) | Over-engineering; spec only requires two views                         |

---

## Research Topic 4: Accessibility for Diff Output

### Decision

Use semantic HTML, ARIA live regions, and text markers (`+`/`-`) alongside color coding.

### Rationale

- Constitution Principle III mandates accessibility-first design
- Color MUST NOT be the sole means of conveying diff information
- Screen readers need to announce diff changes meaningfully

### Implementation Approach

1. **ARIA live region**: Wrap diff output in `aria-live="polite"` so screen readers announce updates
2. **Text markers**: Prefix added segments with `+` and removed segments with `-` (visually subtle but screen-reader accessible)
3. **Semantic roles**: Use `role="status"` for the "No differences found" message
4. **Labels**: Each textarea gets an associated `<label>` ("Original Text" / "Modified Text")
5. **Keyboard navigation**: Toggle button is a standard `<button>` (inherently keyboard-accessible); textarea elements are natively keyboard-accessible
6. **Focus management**: No focus traps; natural tab order flows from left textarea → right textarea → toggle → diff output

### Alternatives Considered

| Approach                         | Rejected Because                                                   |
| -------------------------------- | ------------------------------------------------------------------ |
| `aria-label` on every span       | Too verbose; overwhelms screen readers with per-word announcements |
| Separate accessible text summary | Duplicates content; maintenance burden                             |

---

## Research Topic 5: Performance with Large Inputs (10,000+ lines)

### Decision

Rely on `diffWords()` performance (sufficient for 10K lines) and defer virtualization unless measured performance issues arise.

### Rationale

- `diffWords()` on 10K-line inputs typically completes in <1s in modern browsers
- The spec requires no frame drops >1s, which is achievable without virtualization for text-only rendering
- Premature optimization (e.g., virtual scrolling of diff output) violates the Simplicity principle

### Mitigation Strategies (if needed)

1. **Measure first**: Use `performance.now()` in development to profile diff computation time
2. **Web Worker**: If computation exceeds 500ms, offload `diffWords()` to a Web Worker (future enhancement, not in initial scope)
3. **Virtualized rendering**: If DOM rendering of 10K+ diff segments causes jank, add `react-window` (future enhancement)

### Alternatives Considered

| Approach                      | Rejected Because                                              |
| ----------------------------- | ------------------------------------------------------------- |
| Debounce input                | Spec explicitly says "no debounce" (FR-004)                   |
| Virtualized list from day one | Premature optimization; adds complexity before measuring need |
| Web Worker from day one       | Adds async complexity; measure first per Simplicity principle |
