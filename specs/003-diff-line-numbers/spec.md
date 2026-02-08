# Feature Specification: Diff Line Numbers

**Feature Branch**: `003-diff-line-numbers`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "diff line numbers"

## Clarifications

- Q: Should line numbers appear for all diff methods or only when the method is "lines"? → A: Show line numbers for all three diff methods (characters, words, lines). The system must split word/character-level segments by newlines to reconstruct line-based rows so line numbers are always visible.
- Q: Should the diff output gutter reuse the existing TextInput gutter design pattern? → A: Yes — reuse the existing TextInput gutter style (muted gray, right-aligned, monospace, light background strip) for visual consistency between input and output areas.
- Q: How should the unified view gutter lay out two line numbers (original + modified)? → A: Two narrow columns side by side — left column for original line number, right column for modified line number (GitHub/GitLab convention).
- Q: What should placeholder rows look like in side-by-side view when a line doesn't exist on one side? → A: Follow GitHub convention — empty row with a subtle background tint (faint gray) to indicate the missing line, no line number shown.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Line Numbers in Unified Diff View (Priority: P1)

As a user comparing two texts, I want to see line numbers in the unified diff output so I can quickly reference specific lines when discussing changes.

When the diff output is displayed in unified view, each line of the output shows a gutter on the left with the corresponding line number from the original text and the modified text. This helps orient the user within large diffs.

**Why this priority**: Line numbers are the core value of this feature. The unified view is the default and most-used view mode, so it delivers the highest impact.

**Independent Test**: Paste two multi-line texts with known differences, view the unified diff, and verify that each line in the output has correct line numbers from both the original and modified sources.

**Acceptance Scenarios**:

1. **Given** two multi-line texts with differences, **When** the diff is displayed in unified view, **Then** each output line shows the original line number and modified line number in a gutter
2. **Given** a line that exists only in the original (removed), **When** viewing the unified diff, **Then** the gutter shows the original line number and no modified line number
3. **Given** a line that exists only in the modified text (added), **When** viewing the unified diff, **Then** the gutter shows no original line number and the modified line number
4. **Given** an unchanged line, **When** viewing the unified diff, **Then** the gutter shows both the original and modified line numbers
5. **Given** two identical texts, **When** viewing the diff, **Then** the "No differences found" message is shown without any line numbers

---

### User Story 2 - Line Numbers in Side-by-Side Diff View (Priority: P2)

As a user comparing two texts in side-by-side mode, I want to see line numbers in each column so I can track which line I'm looking at in each version.

When the diff output is displayed in side-by-side view, the original column shows line numbers from the original text and the modified column shows line numbers from the modified text.

**Why this priority**: Extends line number support to the secondary view mode. Depends on the same underlying line-splitting logic as P1.

**Independent Test**: Paste two multi-line texts, switch to side-by-side view on desktop, and verify each column displays correct line numbers.

**Acceptance Scenarios**:

1. **Given** two multi-line texts with differences in side-by-side view, **When** the diff is displayed, **Then** the original column shows original line numbers and the modified column shows modified line numbers
2. **Given** a removed line in side-by-side view, **When** viewing the diff, **Then** the original column shows the line with its number and the modified column shows a blank placeholder row
3. **Given** an added line in side-by-side view, **When** viewing the diff, **Then** the modified column shows the line with its number and the original column shows a blank placeholder row

---

### Edge Cases

- What happens when the diff method is set to "characters" or "words" (non-line-based)? The system splits word/character segments by newlines to reconstruct line-based rows, so line numbers are always visible regardless of diff method.
- What happens when the text has no newlines (single-line input)? The gutter should show line 1 for both sides.
- What happens when one text is much longer than the other? Line numbers should continue incrementing correctly for each side independently.
- What happens with very large line numbers (e.g., 10,000+ lines)? The gutter width should accommodate the number of digits without clipping.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The diff output MUST display line numbers in a gutter alongside each line of diff content in unified view
- **FR-002**: The diff output MUST display line numbers in a gutter alongside each line of diff content in side-by-side view
- **FR-003**: Removed lines MUST show the original line number but no modified line number
- **FR-004**: Added lines MUST show the modified line number but no original line number
- **FR-005**: Unchanged lines MUST show both original and modified line numbers
- **FR-006**: Line numbers MUST reuse the existing TextInput gutter style — muted gray text, right-aligned, monospace font, light background strip — for visual consistency
- **FR-007**: The line number gutter MUST be decorative and hidden from screen readers (aria-hidden)
- **FR-008**: The gutter MUST accommodate varying digit widths without clipping or layout shifts
- **FR-009**: Line numbers MUST be correct when the diff method is "lines" — each segment maps directly to source lines
- **FR-010**: Line numbers MUST be displayed for all diff methods (characters, words, lines) — the system MUST split non-line segments by newlines to reconstruct line-based rows
- **FR-011**: In unified view, the gutter MUST display two side-by-side columns — left for original line number, right for modified line number (GitHub/GitLab convention)
- **FR-012**: In side-by-side view, placeholder rows for missing lines MUST display an empty row with a subtle background tint (faint gray) and no line number, following GitHub convention

### Key Entities

- **DiffLine**: A single line of diff output, containing the text content, diff type (added/removed/unchanged), original line number (if applicable), and modified line number (if applicable)

## Assumptions

- The diff output currently renders segments as inline spans. To support line numbers, the rendering will need to restructure output into discrete rows (one per line).
- The `DiffSegment` type or a new derived type will need to carry line number metadata.
- The `useDiff` hook or a new transformation layer will need to compute line numbers from the raw diff segments.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can identify the exact line number of any change in the diff output within 2 seconds of viewing
- **SC-002**: Line numbers are correct for all three diff methods (characters, words, lines) when the output contains newlines
- **SC-003**: 100% test coverage maintained across all new and modified code
- **SC-004**: All existing quality gates pass (lint, type check, tests, build)
- **SC-005**: Line number gutter does not interfere with screen reader accessibility (aria-hidden)
