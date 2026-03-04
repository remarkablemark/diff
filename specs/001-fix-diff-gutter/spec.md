# Feature Specification: Fix Line Numbers in Diff Gutter

**Feature Branch**: `001-fix-diff-gutter`
**Created**: 2026-03-03
**Status**: Implemented
**Input**: User description: "Fix line numbers in diff gutter"

## Clarifications

### Session 2026-03-03

- Q: How should the two line number columns be visually separated and styled in the unified view gutter? → A: Small gap with subtle vertical divider line, muted color for empty/missing numbers (GitHub-style)
- Q: Should long lines wrap or scroll horizontally? → A: Long lines should scroll horizontally with `whitespace-nowrap` to preserve line alignment
- Q: What HTML structure should be used for perfect line alignment? → A: CSS grid layout with `grid-cols-2` for dual-column line numbers, `overflow-x-auto` container for horizontal scrolling
- Q: How can we ensure line numbers take the same height as content when text wraps? → A: Use CSS grid rows where each row contains both line number and content as sibling cells in the same grid row, ensuring they automatically share the same height

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
- What happens when a line is very long (exceeds viewport width)? The line should scroll horizontally without wrapping, and the line number should stay aligned with the line.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The unified diff view MUST display line numbers in a dual-column gutter with GitHub-style visual treatment:
  - Left column: original line numbers
  - Right column: modified line numbers
  - Small gap between columns (`gap-1` or `gap-2`)
  - Muted color for empty/missing numbers
- **FR-002**: Each line number displayed MUST correspond to the actual line position in the source text (original or modified), not the sequential index in the diff output
- **FR-003**: Removed lines MUST show the correct original line number and blank for modified
- **FR-004**: Added lines MUST show blank for original and the correct modified line number
- **FR-005**: Unchanged lines MUST show both the correct original line number and correct modified line number
- **FR-006**: The diff MUST use the `originalLineNumber` and `modifiedLineNumber` metadata from the `DiffLine` type to display accurate line numbers
- **FR-007**: The gutter width MUST dynamically adjust to accommodate the maximum digit count of line numbers without clipping
- **FR-008**: Line numbers MUST remain correctly aligned with their corresponding diff content lines during scrolling
- **FR-009**: The side-by-side view MUST display correct original line numbers in the original column and correct modified line numbers in the modified column
- **FR-010**: Placeholder rows for missing lines (added lines in original column, removed lines in modified column) MUST NOT display any line number
- **FR-011**: Long lines MUST NOT wrap; they MUST scroll horizontally using `whitespace-nowrap` CSS class
- **FR-012**: The gutter MUST use CSS grid layout (`grid-cols-2`) for dual-column line number display

### Key Entities

- **DiffLine**: A single line of diff output containing text content, diff type (added/removed/unchanged), `originalLineNumber` (the actual line position in the original text, or undefined if added), and `modifiedLineNumber` (the actual line position in the modified text, or undefined if removed)

## Assumptions

- The `segmentsToLines` utility already computes correct `originalLineNumber` and `modifiedLineNumber` metadata for each `DiffLine`
- The `DiffViewer` component has access to the complete `result.lines` array with line number metadata
- CSS grid layout provides reliable row alignment with proper `whitespace-nowrap` on content

## Implementation Notes

### Component Structure

- **DiffViewer**: Main component rendering both unified and side-by-side views. Renders line numbers inline as the first column of each grid row for both view modes
- **SideBySideGutter**: ~~Removed~~ - Was replaced by inline line numbers in side-by-side view (refactored in commit 49c4e28)
- **LineNumberGutter**: ~~Removed~~ - Was replaced by inline line numbers in unified view (refactored in commit 8171732)

### HTML Structure

```html
<!-- Unified View - Grid rows with inline line numbers -->
<div class="grid grid-cols-[auto_1fr]">
  <!-- Data rows: each row contains line number + content -->
  <div class="line-number">1</div>
  <div class="content whitespace-nowrap">line content</div>
  <div class="line-number">2</div>
  <div class="content whitespace-nowrap">more content...</div>
</div>

<!-- Side-by-Side View - Both columns use inline gutters -->
<div class="grid grid-cols-2 gap-4">
  <!-- Original Column -->
  <div class="grid grid-cols-[auto_1fr]">
    <div class="line-number">1</div>
    <div class="content whitespace-nowrap">original</div>
    <div class="line-number">2</div>
    <div class="content whitespace-nowrap">removed</div>
  </div>
  <!-- Modified Column -->
  <div class="grid grid-cols-[auto_1fr]">
    <div class="line-number">1</div>
    <div class="content whitespace-nowrap">modified</div>
    <div class="line-number">2</div>
    <div class="content whitespace-nowrap">added</div>
  </div>
</div>
```

### Key Implementation Details

- **Unified view**: Line numbers are rendered inline as the first column of each grid row, ensuring perfect height alignment with content
- **Side-by-side view**: Both original and modified columns render line numbers inline using the same grid pattern as unified view
- **Grid structure**: `grid-cols-[auto_1fr]` creates two columns - auto-width for line numbers, 1fr for content
- **Row pairing**: Each diff line renders as a Fragment containing two div children (line number cell + content cell)
- **Styling**: Line number cells use `text-right`, `px-2`, `font-mono` for right-aligned monospace numbers; content cells use `pl-2`, `font-mono`
- **Color coding**: Line number cells inherit background colors from their corresponding content (red for removed, green for added, gray for placeholders)
