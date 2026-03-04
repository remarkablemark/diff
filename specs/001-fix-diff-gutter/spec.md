# Feature Specification: Fix Line Numbers in Diff Gutter

**Feature Branch**: `001-fix-diff-gutter`
**Created**: 2026-03-03
**Status**: Draft
**Input**: User description: "Fix line numbers in diff gutter"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Correct Line Numbers in Unified Diff View (Priority: P1)

As a user reviewing differences between two texts, I want the line number gutter in unified view to display the actual source line numbers from the original and modified texts so I can accurately reference specific lines when discussing changes with others.

Currently, the gutter shows sequential numbers (1, 2, 3...) that don't correspond to the actual line numbers in the source texts. The user needs to see the real line numbers from both the original and modified texts side-by-side in the gutter.

**Why this priority**: This is the core issue - line numbers that don't match the source texts are misleading and defeat the purpose of having line numbers for reference and communication.

**Independent Test**: Paste two multi-line texts where lines have been removed or added. Verify that the gutter displays the correct original and modified line numbers that match the actual positions in the source texts, not sequential indices.

**Acceptance Scenarios**:

1. **Given** two texts where the modified text has 3 lines removed from the middle, **When** viewing the unified diff, **Then** lines after the removal show the correct modified line numbers (which will be lower than original line numbers due to the removal)
2. **Given** two texts where the modified text has 5 lines added at the beginning, **When** viewing the unified diff, **Then** unchanged lines show correct original line numbers (1, 2, 3...) and correct modified line numbers (6, 7, 8...)
3. **Given** a removed line at original position 10, **When** viewing the unified diff, **Then** the gutter shows "10" in the original column and blank in the modified column
4. **Given** an added line at modified position 15, **When** viewing the unified diff, **Then** the gutter shows blank in the original column and "15" in the modified column
5. **Given** an unchanged line at original position 5 and modified position 7, **When** viewing the unified diff, **Then** the gutter shows "5" and "7" side-by-side

---

### User Story 2 - Correct Line Numbers in Side-by-Side Diff View (Priority: P2)

As a user comparing texts in side-by-side view, I want each column to display the correct source line numbers so I can track corresponding lines between versions.

The side-by-side view already displays line numbers, but they should be verified to show the correct source line numbers consistently with the unified view fix.

**Why this priority**: Side-by-side view is a secondary view mode. The unified view is the default and most commonly used, so it takes priority.

**Independent Test**: Switch to side-by-side view with texts that have additions and removals. Verify each column shows correct line numbers matching the source texts.

**Acceptance Scenarios**:

1. **Given** two texts with differences in side-by-side view, **When** viewing the diff, **Then** the original column shows correct original line numbers and the modified column shows correct modified line numbers
2. **Given** a removed line in side-by-side view, **When** viewing the diff, **Then** the original column shows the line with its correct line number and the modified column shows a blank placeholder row with no line number
3. **Given** an added line in side-by-side view, **When** viewing the diff, **Then** the modified column shows the line with its correct line number and the original column shows a blank placeholder row with no line number

---

### Edge Cases

- What happens when line numbers have different digit counts (e.g., original has 9 lines, modified has 105 lines)? The gutter width should accommodate the maximum digit count without clipping, and alignment should remain consistent.
- What happens with very large line numbers (1000+)? The gutter should display the full number without truncation.
- What happens when the diff method is "characters" or "words" but the text contains newlines? Line numbers should still be computed correctly based on newline positions within segments.
- What happens when one text is empty? The gutter should show line numbers only for the non-empty text side.
- What happens with consecutive added/removed lines? Each line should show its correct sequential line number on the appropriate side.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The unified diff view gutter MUST display two columns of line numbers side-by-side — left column for original line numbers, right column for modified line numbers
- **FR-002**: Each line number displayed in the gutter MUST correspond to the actual line position in the source text (original or modified), not the sequential index in the diff output
- **FR-003**: Removed lines MUST show the correct original line number in the left column and blank in the right column
- **FR-004**: Added lines MUST show blank in the left column and the correct modified line number in the right column
- **FR-005**: Unchanged lines MUST show both the correct original line number (left) and correct modified line number (right)
- **FR-006**: The gutter MUST use the `originalLineNumber` and `modifiedLineNumber` metadata from the `DiffLine` type to display accurate line numbers
- **FR-007**: The gutter width MUST dynamically adjust to accommodate the maximum digit count of line numbers without clipping
- **FR-008**: Line numbers MUST remain correctly aligned with their corresponding diff content lines during scrolling
- **FR-009**: The side-by-side view MUST display correct original line numbers in the original column and correct modified line numbers in the modified column
- **FR-010**: Placeholder rows for missing lines (added lines in original column, removed lines in modified column) MUST NOT display any line number

### Key Entities

- **DiffLine**: A single line of diff output containing text content, diff type (added/removed/unchanged), `originalLineNumber` (the actual line position in the original text, or undefined if added), and `modifiedLineNumber` (the actual line position in the modified text, or undefined if removed)

## Assumptions

- The `segmentsToLines` utility already computes correct `originalLineNumber` and `modifiedLineNumber` metadata for each `DiffLine`
- The `DiffViewer` component has access to the complete `result.lines` array with line number metadata
- The existing `LineNumberGutter` component can be modified to accept and display dual line number columns instead of sequential indices

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can identify the exact source line number of any change within 2 seconds of viewing the diff
- **SC-002**: 100% of displayed line numbers match the actual line positions in the source texts (verifiable via automated tests)
- **SC-003**: All existing quality gates pass (lint, type check, tests, build) with no regressions
- **SC-004**: Line number display remains correct across all three diff methods (characters, words, lines)
- **SC-005**: Line numbers remain correctly aligned with content during vertical scrolling (no misalignment visible)
