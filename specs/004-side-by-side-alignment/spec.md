# Feature Specification: Side-by-Side Diff Alignment

**Feature Branch**: `004-side-by-side-alignment`
**Created**: 2026-03-04
**Status**: Completed
**Input**: User observation: "Would it make sense in SideBySideView to align the original and modified diff next to each other?"

## Problem Statement

In the side-by-side diff view, consecutive removed and added lines were displayed on separate rows with empty placeholders, making it difficult to see what changed between the original and modified versions. This is inconsistent with standard diff tools (GitHub, GitLab, etc.) which align removed/added lines on the same row for easier comparison.

### Before

- Line 3 (removed) appeared on its own row with empty space on the right
- Line 3 (added) appeared on the next row with empty space on the left
- Users had to visually scan across multiple rows to understand what changed

### After

- Consecutive removed/added lines are paired together on the same row
- Removed content appears on the left, added content on the right
- Users can immediately see what was changed by comparing horizontally

## Requirements

### Functional Requirements

- **FR-001**: System MUST pair consecutive removed and added lines on the same row in side-by-side view
- **FR-002**: System MUST handle multiple consecutive removed lines followed by multiple consecutive added lines by pairing them in order (1st removed with 1st added, 2nd removed with 2nd added, etc.)
- **FR-003**: System MUST handle unequal numbers of removed and added lines by filling remaining rows with placeholders
- **FR-004**: System MUST preserve existing behavior for non-consecutive removed/added lines (separated by unchanged lines)
- **FR-005**: System MUST maintain correct line numbering for both original and modified sides

### Technical Requirements

- **TR-001**: The `pairLines` function MUST use a look-ahead algorithm to group consecutive removed/added lines
- **TR-002**: Implementation MUST maintain 100% test coverage
- **TR-003**: All existing tests MUST continue to pass with updated expectations

## Implementation Details

### Modified Component

- `src/components/DiffViewer/SideBySideView.tsx`

### Algorithm

The `pairLines` function was updated to:

1. Iterate through diff lines sequentially
2. When encountering a removed line, collect all consecutive removed lines
3. Look ahead to collect any consecutive added lines that follow
4. Pair them together using the maximum count (filling with `null` for missing entries)
5. Continue with remaining lines

### Test Coverage

Added comprehensive tests covering:

- Consecutive removed/added lines aligned on same row
- Multiple consecutive removed/added lines
- More removed lines than added lines
- More added lines than removed lines
- Non-consecutive removed/added lines (with unchanged lines between them)

## Success Criteria

- ✅ **SC-001**: Consecutive removed and added lines appear on the same row in side-by-side view
- ✅ **SC-002**: Line numbers remain accurate for both original and modified columns
- ✅ **SC-003**: All 113 tests pass with 100% coverage (statements, branches, functions, lines)
- ✅ **SC-004**: No visual regression in unified view or other components
- ✅ **SC-005**: Improved user experience matches standard diff tool behavior

## Verification

```bash
# Run tests with coverage
npm run test:ci

# Expected results:
# ✓ All 113 tests passing
# ✓ 100% coverage across all metrics
```

## Related Specs

- `001-text-diff` - Original diff implementation
