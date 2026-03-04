# Quickstart: Fix Line Numbers in Diff Gutter

**Date**: 2026-03-03 | **Feature**: 001-fix-diff-gutter

## Overview

This feature fixes the unified diff view gutter to display actual source line numbers instead of sequential indices. The gutter shows two columns (original | modified) with GitHub-style visual treatment.

## Development Setup

```bash
# Ensure you're on the feature branch
git checkout 001-fix-diff-gutter

# Install dependencies (if not already done)
npm install

# Start development server
npm start
```

## Files to Modify

1. **src/components/LineNumberGutter/LineNumberGutter.types.ts**
   - Update props interface to accept `lines: DiffLine[]`

2. **src/components/LineNumberGutter/LineNumberGutter.tsx**
   - Implement dual-column rendering
   - Add GitHub-style visual treatment

3. **src/components/LineNumberGutter/LineNumberGutter.test.tsx**
   - Add tests for dual-column display
   - Test all acceptance scenarios from spec

4. **src/components/DiffViewer/DiffViewer.tsx**
   - Update `LineNumberGutter` usage to pass `lines` prop

5. **src/components/DiffViewer/DiffViewer.test.tsx**
   - Add integration tests for line number accuracy

## Implementation Order

1. Update types (`LineNumberGutter.types.ts`)
2. Implement component logic (`LineNumberGutter.tsx`)
3. Write unit tests (`LineNumberGutter.test.tsx`)
4. Integrate with `DiffViewer`
5. Write integration tests
6. Run quality gates

## Quality Gates

Run all before committing:

```bash
# Lint (zero errors)
npm run lint

# Type check (zero errors)
npm run lint:tsc

# Tests (100% coverage required)
npm run test:ci

# Build (clean production build)
npm run build
```

## Testing Scenarios

Test these cases manually in the browser:

1. **Lines removed from middle**: Verify modified line numbers are lower than original
2. **Lines added at beginning**: Verify unchanged lines show correct offset
3. **Removed line**: Shows original number, blank modified column
4. **Added line**: Shows blank original column, modified number
5. **Unchanged line**: Shows both numbers side-by-side
6. **Scroll alignment**: Line numbers stay aligned during scroll

## Accessibility Check

- Gutter remains `aria-hidden="true"` (decorative)
- Content area has `aria-live="polite"`
- Keyboard navigation works (tab through interactive elements)
- Screen reader announces diff content correctly

## Visual Reference

Compare against GitHub's diff view:

- Two narrow columns in gutter
- Subtle vertical divider between columns
- Muted gray for empty/missing numbers
- Consistent alignment with content rows

## Definition of Done

- [ ] All functional requirements implemented (FR-001 through FR-010)
- [ ] All acceptance scenarios passing
- [ ] 100% test coverage maintained
- [ ] Lint passes with zero errors
- [ ] Type check passes with zero errors
- [ ] Build succeeds
- [ ] Manual testing completed for all scenarios
- [ ] No visual regressions
- [ ] Accessibility verified

## Next Steps

After implementation:

1. Run `/speckit.tasks` to generate task breakdown
2. Commit changes with conventional commit message
3. Create pull request
4. Request review
