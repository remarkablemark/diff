# Feature Specification: Toggle Diff Options

**Feature Branch**: `002-toggle-diff-options`
**Created**: 2026-02-08
**Status**: Draft
**Input**: User description: "toggle diff options"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Toggle Diff Method (Priority: P1)

A user wants to switch between different diff comparison methods to get the most useful view of their changes. The app currently uses word-level diffing only. The user should be able to toggle between character-level, word-level, and line-level diff methods via a control in the diff output area. The selected method immediately recomputes and re-renders the diff output.

**Why this priority**: The diff method fundamentally changes what the user sees. Word-level diff is not always ideal — character-level is better for small edits (typos, variable renames), while line-level is better for large structural changes (reordering paragraphs, adding/removing blocks). This is the core value of the feature.

**Independent Test**: Select two texts with known differences, toggle between character/word/line diff methods, and verify the diff output changes to reflect the selected granularity.

**Acceptance Scenarios**:

1. **Given** two texts with differences are entered, **When** the user selects "Characters" diff method, **Then** the diff output shows character-level differences
2. **Given** two texts with differences are entered, **When** the user selects "Words" diff method, **Then** the diff output shows word-level differences (current default behavior)
3. **Given** two texts with differences are entered, **When** the user selects "Lines" diff method, **Then** the diff output shows line-level differences
4. **Given** the diff method toggle is displayed, **When** the page first loads, **Then** "Words" is selected as the default method
5. **Given** the diff method is changed, **When** the user types in either textarea, **Then** the diff updates in real time using the currently selected method

---

### User Story 2 - Trim Whitespace Toggle (Priority: P2)

A user comparing text that may have trailing spaces, inconsistent indentation, or extra blank lines wants the option to ignore whitespace differences. A toggle allows the user to enable or disable whitespace trimming before the diff is computed. When enabled, leading/trailing whitespace on each line is stripped and consecutive blank lines are collapsed before comparison.

**Why this priority**: Whitespace differences are often noise — especially when comparing code copied from different editors or text pasted from different sources. This toggle lets users focus on meaningful content changes.

**Independent Test**: Enter two texts that differ only in whitespace (e.g., trailing spaces, extra blank lines), toggle "Trim whitespace" on, and verify the diff shows "No differences found." Toggle it off and verify whitespace differences appear.

**Acceptance Scenarios**:

1. **Given** two texts that differ only in whitespace, **When** the user enables "Trim whitespace", **Then** the diff output shows "No differences found"
2. **Given** two texts that differ only in whitespace, **When** "Trim whitespace" is disabled, **Then** the diff output highlights the whitespace differences
3. **Given** "Trim whitespace" is enabled, **When** the user enters texts with both whitespace and content differences, **Then** only content differences are shown
4. **Given** the trim whitespace toggle is displayed, **When** the page first loads, **Then** "Trim whitespace" is disabled by default

---

### User Story 3 - Case Sensitivity Toggle (Priority: P3)

A user comparing text wants the option to ignore case differences. A toggle allows the user to enable or disable case-insensitive comparison. When enabled, the diff treats uppercase and lowercase letters as equivalent.

**Why this priority**: Case differences are sometimes irrelevant (e.g., comparing SQL keywords, HTML tags, or prose with inconsistent capitalization). This is a convenience feature that builds on the options pattern established by US1 and US2.

**Independent Test**: Enter two texts that differ only in letter casing (e.g., "Hello" vs "hello"), toggle "Ignore case" on, and verify the diff shows "No differences found." Toggle it off and verify the case differences appear.

**Acceptance Scenarios**:

1. **Given** two texts that differ only in letter casing, **When** the user enables "Ignore case", **Then** the diff output shows "No differences found"
2. **Given** two texts that differ only in letter casing, **When** "Ignore case" is disabled, **Then** the diff output highlights the case differences
3. **Given** "Ignore case" is enabled, **When** the user enters texts with both case and content differences, **Then** only content differences are shown
4. **Given** the case sensitivity toggle is displayed, **When** the page first loads, **Then** "Ignore case" is disabled by default

---

### Edge Cases

- What happens when the user toggles diff method while both inputs are empty? The diff output remains hidden (no change in behavior).
- What happens when the user enables both "Trim whitespace" and "Ignore case" simultaneously? Both transformations are applied before diffing — whitespace is trimmed first, then case is normalized.
- What happens when switching from line-level diff to character-level diff on very large texts? The diff recomputes immediately; no special handling is needed for the MVP.
- What happens when "Trim whitespace" is enabled and the texts differ only in indentation? The diff shows "No differences found."

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a control to select the diff comparison method from: characters, words (default), and lines
- **FR-002**: System MUST recompute the diff output immediately when the diff method selection changes
- **FR-003**: System MUST default to word-level diff on page load (preserving current behavior)
- **FR-004**: System MUST provide a toggle to enable/disable whitespace trimming before diff computation
- **FR-005**: When whitespace trimming is enabled, system MUST strip leading and trailing whitespace from each line and collapse consecutive blank lines before comparison
- **FR-006**: System MUST default to whitespace trimming disabled on page load
- **FR-007**: System MUST provide a toggle to enable/disable case-insensitive comparison
- **FR-008**: When case-insensitive comparison is enabled, system MUST normalize both texts to the same case before comparison
- **FR-009**: System MUST default to case-insensitive comparison disabled on page load
- **FR-010**: All diff option controls MUST be visible whenever the diff output is visible
- **FR-011**: All diff option changes MUST take effect immediately without requiring any additional user action
- **FR-012**: Diff options MUST work correctly in combination (e.g., trim whitespace + ignore case + line-level diff)
- **FR-013**: Diff option controls MUST be keyboard accessible

### Key Entities

- **DiffMethod**: The granularity of comparison — characters, words, or lines
- **DiffOptions**: A collection of settings that control how the diff is computed — includes the diff method, whitespace trimming flag, and case sensitivity flag

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: User can switch between character, word, and line diff methods in a single click and see the diff output update immediately
- **SC-002**: User can toggle whitespace trimming and see the diff output update to include or exclude whitespace differences
- **SC-003**: User can toggle case sensitivity and see the diff output update to include or exclude case differences
- **SC-004**: All diff option controls are accessible via keyboard navigation
- **SC-005**: All existing tests continue to pass (no regressions)
- **SC-006**: 100% test coverage is maintained
