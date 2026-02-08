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

---

## Research Topic 6: Responsive Layout for Two-Panel Diff UI

### Decision

Use Tailwind responsive prefixes (`md:`) to switch between stacked (mobile) and side-by-side (desktop) layouts. Textareas have a fixed max height with internal scrolling on all screen sizes.

### Rationale

- **Standard pattern**: Stacking columns on mobile is the most common responsive approach for two-panel UIs
- **Tailwind-native**: `md:flex-row` / `flex-col` requires zero custom CSS — aligns with Simplicity principle
- **Fixed-height textareas**: Prevents excessive page scrolling when content is long; users scroll within each textarea independently
- **Auto-unified diff on mobile**: Side-by-side diff columns are unreadable on narrow screens (<768px), so the diff view forces unified mode and hides the toggle below `md:`

### Implementation Approach

1. **Input layout**: `flex flex-col md:flex-row gap-4` on the container wrapping both `TextInput` components
2. **Textarea height**: `max-h-64 overflow-y-auto` (or similar) on each textarea + gutter wrapper — consistent on all breakpoints
3. **ViewToggle visibility**: `hidden md:flex` — toggle is hidden on mobile, visible on `md:` and above
4. **DiffViewer**: When viewport is below `md:`, always render unified view regardless of `viewMode` state. Use a `useMediaQuery` hook or check `window.matchMedia('(min-width: 768px)')` to determine effective view mode
5. **Diff output layout**: Full width on all breakpoints (single column for unified, two-column grid for side-by-side on desktop)

### Alternatives Considered

| Approach                               | Rejected Because                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Always side-by-side (pinch-zoom)       | Poor mobile UX; textareas become too narrow to read or type in                                   |
| Tabbed inputs on mobile                | Adds UI complexity (tab state, switching); stacking is simpler and keeps both inputs visible     |
| Desktop-only with mobile warning       | Excludes mobile users entirely; unnecessary given that the UI adapts well with responsive layout |
| Variable textarea height (grow to fit) | Causes excessive page scrolling with long content; fixed height + internal scroll is more usable |

---

## Research Topic 7: Dark Mode with `prefers-color-scheme`

### Decision

Use Tailwind CSS 4's built-in dark mode support (`dark:` variant) driven by the `prefers-color-scheme` media query. No manual toggle — the app follows the user's system preference.

### Rationale

- **Zero runtime cost**: `prefers-color-scheme` is a CSS media query — no JavaScript needed for detection
- **Tailwind-native**: `dark:` prefix is built into Tailwind 4; no configuration needed beyond ensuring `@tailwindcss` is imported
- **Developer audience**: Developers frequently use dark mode; auto-detecting system preference provides the best default experience
- **No added state**: No theme toggle state to manage — aligns with Simplicity principle

### Implementation Approach

1. **Tailwind 4 dark mode**: Tailwind 4 uses `@media (prefers-color-scheme: dark)` by default for `dark:` variants — no config change needed
2. **Base colors**: Apply `bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100` on the root element
3. **Textarea styling**: `bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600`
4. **Diff highlights (light)**: `bg-red-100 text-red-800` (removed), `bg-green-100 text-green-800` (added)
5. **Diff highlights (dark)**: `dark:bg-red-900/30 dark:text-red-300` (removed), `dark:bg-green-900/30 dark:text-green-300` (added)
6. **"No differences found" message**: `text-gray-500 dark:text-gray-400`
7. **ViewToggle buttons**: `bg-gray-100 dark:bg-gray-700` for inactive, `bg-blue-500 dark:bg-blue-600 text-white` for active
8. **Line number gutter**: `bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500`

### Color Accessibility in Dark Mode

- Red/green diff highlights use both background tint and text color shift — not color alone (supplemented by `+`/`-` markers per Research Topic 4)
- Dark mode colors chosen for sufficient contrast: light text on dark tinted backgrounds
- Tested against WCAG AA contrast ratios: `red-300` on `red-900/30` and `green-300` on `green-900/30` both exceed 4.5:1

### Alternatives Considered

| Approach                       | Rejected Because                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| Manual toggle (light/dark)     | Adds UI complexity and state management; system preference is sufficient for MVP            |
| CSS custom properties (no TW)  | Reinvents what Tailwind `dark:` provides natively; violates Tailwind-only styling principle |
| Three themes (light/dark/auto) | Over-engineering for MVP; auto-only is simplest                                             |
| No dark mode                   | Developer tool used in dark environments; poor UX for a significant portion of users        |
