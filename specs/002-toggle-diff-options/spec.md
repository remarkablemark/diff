# Feature Specification: Toggle Diff Options

**Feature Branch**: `002-toggle-diff-options`
**Created**: 2026-02-08
**Status**: Draft
**Input**: User description: "toggle diff options"

## Clarifications

### Session 2026-02-08

- Q: What UI pattern should the diff method control use? → A: Same segmented button group as the existing ViewToggle — 3 adjacent buttons (Characters | Words | Lines) matching the existing style, placed alongside it in the diff header.
- Q: Where is the diff method toggle placed relative to the view mode toggle? → A: Left side of diff header — diff method toggle replaces/sits next to the "Diff" label, view mode toggle stays on the right.
- Q: How is the diff method selection state handled? → A: Same as ViewToggle — `useState<DiffMethod>('words')` in App, passed as prop to the toggle component, App passes diffMethod to useDiff.
- Q: Should the user's diff method selection persist across page reloads? → A: Yes, persist to localStorage. Also persist the view mode (Unified/Side-by-Side) selection.

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

### Edge Cases

- What happens when the user toggles diff method while both inputs are empty? The diff output remains hidden (no change in behavior).
- What happens when switching from line-level diff to character-level diff on very large texts? The diff recomputes immediately; no special handling is needed for the MVP.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a segmented button group control (matching the existing view mode toggle pattern) to select the diff comparison method from: characters, words (default), and lines
- **FR-002**: System MUST recompute the diff output immediately when the diff method selection changes
- **FR-003**: System MUST default to word-level diff on page load (preserving current behavior)
- **FR-004**: All diff option controls MUST be visible whenever the diff output is visible
- **FR-005**: All diff option changes MUST take effect immediately without requiring any additional user action
- **FR-006**: Diff option controls MUST be keyboard accessible
- **FR-007**: Diff method state MUST be managed in the App component via the same pattern as the existing view mode state (lifted state, passed as props)
- **FR-008**: System MUST persist the selected diff method to localStorage and restore it on page load, falling back to "words" if no saved value exists
- **FR-009**: System MUST persist the selected view mode (unified/side-by-side) to localStorage and restore it on page load, falling back to "unified" if no saved value exists

### Key Entities

- **DiffMethod**: The granularity of comparison — characters, words, or lines

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: User can switch between character, word, and line diff methods in a single click and see the diff output update immediately
- **SC-002**: All diff option controls are accessible via keyboard navigation
- **SC-003**: All existing tests continue to pass (no regressions)
- **SC-004**: 100% test coverage is maintained
