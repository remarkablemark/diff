# Research: Fix Line Numbers in Diff Gutter

**Date**: 2026-03-03 | **Feature**: 001-fix-diff-gutter

## Technical Decisions

### Decision 1: Dual-Column Gutter Rendering Approach

**What was chosen**: Modify `LineNumberGutter` component to accept `lines: DiffLine[]` array and render two columns per row using CSS grid.

**Why chosen**:

- Direct access to `originalLineNumber` and `modifiedLineNumber` from `DiffLine` metadata
- Ensures perfect alignment between gutter and content rows
- Leverages existing `segmentsToLines` utility that already computes correct line numbers
- Minimal changes to `DiffViewer` component structure

**Alternatives considered**:

- Separate gutter components for original/modified: Rejected due to synchronization complexity
- CSS-only dual-column approach: Rejected because line numbers come from data, not CSS counters
- Inline line numbers in content area: Rejected because spec requires separate gutter for visual consistency

---

### Decision 2: GitHub-Style Visual Treatment

**What was chosen**: Two narrow columns with subtle vertical divider, muted gray for missing numbers.

**Why chosen**:

- Follows established GitHub/GitLab convention users are familiar with
- Clear visual separation prevents reading errors
- Muted colors for empty cells reduce visual noise
- Accessible without relying solely on color differentiation

**Alternatives considered**:

- Single space separator: Rejected for insufficient visual separation
- Distinct background strips: Rejected as too visually heavy for this utility app
- Different text colors per column: Rejected; color alone shouldn't convey meaning

---

### Decision 3: Scroll Synchronization

**What was chosen**: Reuse existing `useScrollSync` hook pattern for gutter-content alignment.

**Why chosen**:

- Existing hook already handles scroll position synchronization
- Proven pattern in codebase (tested in `TextInput` component)
- No new dependencies or complexity

**Alternatives considered**:

- Native CSS `position: sticky`: Rejected; doesn't handle horizontal scroll sync
- Ref-based direct DOM manipulation: Rejected; React anti-pattern

---

### Decision 4: Type Safety for Dual-Column Props

**What was chosen**: Extend `LineNumberGutterProps` interface with `lines: DiffLine[]` and `viewMode?: 'unified' | 'side-by-side'`.

**Why chosen**:

- Maintains TypeScript strict mode compliance
- Enables compile-time validation of line number data
- Clear component contract for future maintainers

**Alternatives considered**:

- Separate props for original/modified line arrays: Rejected; loses correlation between pairs
- Generic props with union types: Rejected; over-engineering for this use case

---

## Best Practices Applied

### React Component Design

- Functional component with implicit TypeScript typing (no `React.FC`)
- Props interface in separate `.types.ts` file
- Co-located test file with full coverage
- Avoid `useMemo` unless profiling shows performance issues (YAGNI)
- `useRef` for DOM access (scroll synchronization)

### Accessibility

- Gutter remains `aria-hidden` (decorative)
- Content area retains `aria-live="polite"` for diff updates
- Keyboard navigation unaffected (gutter is not interactive)

### Testing Strategy

- Unit tests for `LineNumberGutter` rendering
- Integration tests in `DiffViewer.test.tsx`
- Test scenarios cover all acceptance criteria from spec
- Maintain 100% coverage across statements, branches, functions, lines

### CSS/Tailwind Approach

- Utility classes only (no custom CSS)
- CSS grid for dual-column layout
- Consistent spacing with existing design tokens
- Responsive considerations (side-by-side view on desktop only)

---

## Implementation Risks & Mitigations

| Risk                           | Likelihood | Impact | Mitigation                                                               |
| ------------------------------ | ---------- | ------ | ------------------------------------------------------------------------ |
| Scroll misalignment            | Medium     | High   | Extensive testing with various content lengths; use `useScrollSync` hook |
| Line number computation errors | Low        | High   | Rely on existing `segmentsToLines` tests; add regression tests           |
| Visual regression              | Medium     | Medium | Manual testing; compare against GitHub diff view                         |
| Performance with large diffs   | Low        | Medium | Use `useMemo` for line number arrays; monitor render times               |
| Accessibility regression       | Low        | High   | Verify aria attributes unchanged; screen reader testing                  |

---

## References

- Existing `segmentsToLines.ts` utility (already computes correct line numbers)
- Existing `LineNumberGutter.tsx` component (base implementation)
- GitHub diff view pattern (visual reference)
- Constitution v1.0.0 (technology constraints)
