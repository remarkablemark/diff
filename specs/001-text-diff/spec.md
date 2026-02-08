# Feature Specification: Diff

**Feature Branch**: `001-text-diff`
**Created**: 2026-02-07
**Status**: Draft
**Input**: User description: "check diff between 2 text inputs"

## Clarifications

### Session 2026-02-07

- Q: Which diff computation library should be used? → A: `diff` (`npm: diff`) — established library, ~10KB, supports line/word/character modes, TypeScript support.
- Q: What diff display format should be used? → A: Both unified inline and side-by-side views, with a toggle switch for the user to choose between them.
- Q: What diff granularity should be used? → A: Word-level — differences highlighted at word boundaries within lines for best readability.
- Q: What component should be used for text input? → A: Plain `<textarea>` elements with a synced line number gutter, styled with Tailwind. No external editor library.
- Q: How should the diff output be rendered? → A: Custom React components styled with Tailwind utility classes. No external diff rendering library.
- Q: What is displayed when textareas are empty? → A: Diff output area is completely empty/hidden until both textareas have content.
- Q: What is displayed when texts are identical (no diff)? → A: A short message like "No differences found" is shown in the diff output area.
- Q: Should diff computation be debounced for real-time updates? → A: No debounce — recompute diff on every keystroke immediately.
- Q: How should the layout adapt on mobile/small screens? → A: Responsive stacking — side-by-side on `md:` (768px+), stacked vertically on smaller screens. Textareas have a fixed max height and scroll internally to keep the page compact.
- Q: How should the side-by-side diff view behave on mobile? → A: Auto-unified on mobile — force unified view below `md:` breakpoint; the view toggle is only visible on `md:` and above.
- Q: Should the app support dark mode? → A: Yes — auto-detect via `prefers-color-scheme` and apply dark variants to all elements including diff color coding.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Compare Two Text Inputs (Priority: P1)

A user visits the app and sees two side-by-side text areas. They enter or paste text into both areas and the system displays the differences between the two texts, highlighting additions, deletions, and unchanged portions.

**Why this priority**: This is the core value proposition of the application. Without the ability to input two texts and see their differences, the app has no purpose.

**Independent Test**: Can be fully tested by entering different text in each input area and verifying that the diff output correctly highlights the differences between them.

**Acceptance Scenarios**:

1. **Given** the app is loaded with two empty text areas, **When** the user enters "hello world" in the first area and "hello there" in the second area, **Then** the system displays a diff result showing "world" as removed and "there" as added.
2. **Given** the app is loaded, **When** the user enters identical text in both areas, **Then** the system displays a "No differences found" message in the diff output area.
3. **Given** the app is loaded, **When** the user enters text in only one area and leaves the other empty, **Then** the system displays the entire text as either fully added or fully removed depending on which area contains text.

---

### User Story 2 - Visual Diff Output with Color Coding (Priority: P2)

A user compares two texts and the diff result is displayed with clear visual indicators: removed text is highlighted in red, added text is highlighted in green, and unchanged text is displayed normally. The user can toggle between a unified inline view (single column with interleaved changes) and a side-by-side view (two columns with aligned lines). This allows the user to quickly scan and understand the differences at a glance using their preferred format.

**Why this priority**: Without clear visual distinction, the diff output would be difficult to interpret. Color-coded output is essential for usability but depends on the core diff comparison (P1) being in place first.

**Independent Test**: Can be fully tested by comparing two texts with known differences and verifying that additions appear in green, deletions appear in red, and unchanged text has no special highlighting.

**Acceptance Scenarios**:

1. **Given** a diff result has been computed, **When** the result is displayed, **Then** removed portions are visually distinct (red background or similar) from added portions (green background or similar).
2. **Given** a diff result contains only unchanged text, **When** the result is displayed, **Then** no color highlighting is applied.

---

### User Story 3 - Real-Time Diff Updates (Priority: P3)

A user modifies text in either input area and the diff output updates automatically without requiring a manual action (such as pressing a button). This provides an immediate, interactive experience.

**Why this priority**: Real-time updates improve the user experience significantly but are an enhancement over a button-triggered diff. The core comparison and visual output must work first.

**Independent Test**: Can be fully tested by typing in one of the text areas and verifying that the diff output updates as the user types, without any additional user action.

**Acceptance Scenarios**:

1. **Given** both text areas contain text and a diff is displayed, **When** the user modifies text in either area, **Then** the diff output updates automatically to reflect the new differences.
2. **Given** one text area is empty, **When** the user begins typing in it, **Then** the diff output updates with each keystroke.

---

### Edge Cases

- What happens when both text areas are empty? The diff output area is hidden until both textareas have content.
- What happens when the user pastes a very large text (e.g., 10,000+ lines)? The system should still compute and display the diff without freezing the interface.
- What happens when text contains special characters, unicode, or emoji? The diff should handle all valid text content correctly.
- What happens when text contains only whitespace differences (spaces, tabs, newlines)? The diff should detect and display whitespace-only changes.
- What happens when one input is cleared after a diff has been displayed? The diff output should update to reflect the new state.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide two text input areas (plain `<textarea>` elements with line number gutters) where users can enter or paste text.
- **FR-002**: System MUST compute a word-level diff between the contents of the two text input areas using the `diff` library (`npm: diff`).
- **FR-003**: System MUST display the diff result with visual color coding — removed text in red tones and added text in green tones — in both a unified inline view and a side-by-side view, with a toggle to switch between them. On screens below the `md:` breakpoint (768px), the diff MUST default to unified view and the view toggle MUST be hidden. Rendering MUST use custom React components styled with Tailwind (no external diff rendering library).
- **FR-004**: System MUST update the diff output automatically on every keystroke (no debounce) when the content of either text input area changes.
- **FR-005**: System MUST handle empty inputs gracefully by hiding the diff output area until both textareas contain text.
- **FR-006**: System MUST correctly handle multi-line text, preserving line breaks in both input and output.
- **FR-007**: System MUST support special characters, unicode, and emoji in both inputs without errors.
- **FR-008**: System MUST remain responsive when processing large text inputs (up to 10,000 lines).
- **FR-009**: System MUST display a "No differences found" message in the diff output area when both inputs contain identical text.
- **FR-010**: System MUST use a responsive layout — side-by-side text inputs on `md:` breakpoint (768px+) and stacked vertically on smaller screens. Textareas MUST have a fixed max height with internal scrolling to keep the page compact on all screen sizes.
- **FR-011**: System MUST support dark mode via `prefers-color-scheme` media query, automatically applying dark variants to all UI elements including diff color coding (red/green highlights must remain distinguishable in both light and dark themes).

### Key Entities

- **Text Input**: A block of user-provided text. Key attributes: content (string), position (left/original or right/modified).
- **Diff Result**: The computed comparison between two text inputs. Key attributes: list of diff segments, each with a type (added, removed, unchanged) and content (string).
- **Diff Segment**: A contiguous portion of text within the diff result. Key attributes: type (added, removed, unchanged), content (the text of this segment).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can paste two texts and see a color-coded diff result within 2 seconds for inputs up to 1,000 lines each.
- **SC-002**: 95% of users can identify all differences between two texts on their first attempt using the diff output.
- **SC-003**: The diff output updates within 500 milliseconds of the user finishing a keystroke in either input area.
- **SC-004**: The application handles text inputs of up to 10,000 lines without the interface becoming unresponsive (no frame drops exceeding 1 second).
- **SC-005**: All user stories pass their defined acceptance scenarios with 100% test coverage.
