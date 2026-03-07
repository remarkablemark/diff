# Feature Specification: Query String State Persistence

**Feature Branch**: `001-querystring-state`  
**Created**: 2026-03-07  
**Status**: Draft  
**Input**: User description: "save/load from querystring"

## Clarifications

### Session 2026-03-07

- Q: When should the URL update during rapid user input (e.g., typing in text fields)? → A: Debounce URL updates (wait for pause in typing, e.g., 300-500ms after last change)
- Q: How should the system handle scenarios where the state data is too large to fit in the URL? → A: Compress state data using lz-string before encoding; show warning if still too large
- Q: Which specific application settings should be persisted in the URL? → A: Diff texts + comparison method/algorithm selection. URL parameters take precedence over localStorage values when both exist.
- Q: How should URL updates affect the browser's history stack? → A: Replace current history entry (replaceState) - keeps history clean, no undo via back button
- Q: What naming convention should be used for query parameters? → A: Short descriptive names using keys: `original`, `modified`, `method`, `view`. Compress values of `original` and `modified` using lz-string. Do not compress `method` and `view` values.
- Q: What are the allowed values for method and view query parameters? → A: `method` accepts: `characters`, `words` (default), `lines`. `view` accepts: `unified` (default), `side-by-side`.

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Save Application State to URL (Priority: P1)

A user configures the diff tool with specific settings (input text, comparison method, display options) and wants to share this exact configuration with others or bookmark it for later use. The application automatically encodes the current state into the URL query string, allowing the user to copy and share the URL.

**Why this priority**: This is the core value proposition - enabling state persistence and sharing without requiring backend storage or user accounts. It's the foundation that makes all other features possible.

**Independent Test**: Can be fully tested by changing any application setting, verifying the URL updates automatically, copying the URL, and confirming it contains encoded state parameters.

**Acceptance Scenarios**:

1. **Given** the user has entered text in both diff input fields, **When** the text changes, **Then** the URL query string updates to include the encoded text values
2. **Given** the user selects a different comparison method, **When** the selection changes, **Then** the URL query string updates to reflect the new method
3. **Given** the user has configured multiple settings, **When** any setting changes, **Then** the URL updates to include all current state values without losing other parameters

---

### User Story 2 - Load Application State from URL (Priority: P2)

A user receives a URL with encoded state (from a colleague, bookmark, or previous session) and wants to restore the exact configuration. When the user navigates to the URL, the application automatically reads the query string parameters and restores all settings to match the encoded state.

**Why this priority**: This completes the save/load cycle and enables the sharing use case. Without this, saving state to URL provides no value.

**Independent Test**: Can be fully tested by navigating to a URL with query parameters and verifying all application settings are restored correctly, independent of any save functionality.

**Acceptance Scenarios**:

1. **Given** a URL contains encoded diff text parameters, **When** the user navigates to that URL, **Then** both input fields are populated with the decoded text values
2. **Given** a URL contains a comparison method parameter, **When** the page loads, **Then** the specified comparison method is selected
3. **Given** a URL contains multiple state parameters, **When** the page loads, **Then** all settings are restored to match the encoded values

---

### User Story 3 - Handle Invalid or Missing Parameters (Priority: P3)

A user navigates to a URL with malformed, incomplete, or missing query parameters. The application gracefully handles these scenarios by using default values for missing parameters and ignoring invalid ones, ensuring the application remains functional.

**Why this priority**: This is a defensive feature that ensures robustness but doesn't provide new user value. It prevents errors but isn't required for the happy path.

**Independent Test**: Can be fully tested by navigating to URLs with various invalid parameter combinations and verifying the application loads with sensible defaults without errors.

**Acceptance Scenarios**:

1. **Given** a URL contains no query parameters, **When** the page loads, **Then** the application displays with default empty state
2. **Given** a URL contains malformed encoded data, **When** the page loads, **Then** the application ignores the invalid parameter and uses default values
3. **Given** a URL contains only some state parameters, **When** the page loads, **Then** the application restores available parameters and uses defaults for missing ones

### Edge Cases

- What happens when the encoded state exceeds URL length limits (typically 2000-8000 characters depending on browser)? → System compresses text values using lz-string and shows warning if still too large
- How does the system handle special characters, unicode, or emoji in the diff text? → Handled via lz-string compression and standard URL encoding
- What happens when query parameters are manually edited to invalid values? → System ignores invalid parameters and uses default values
- How does the system handle concurrent state updates (rapid user input causing multiple URL updates)? → Debouncing prevents excessive updates (300-500ms delay after last change)
- What happens when the user uses browser back/forward navigation with different query string states? → System uses replaceState to avoid polluting browser history; back/forward navigation works with intentional page navigations
- How does the system handle URL encoding/decoding for characters that have special meaning in URLs (?, &, =, #, etc.)? → Standard URL encoding applied after lz-string compression

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST encode current application state into URL query string parameters using debounced updates (300-500ms after last change)
- **FR-002**: System MUST decode query string parameters on page load and restore application state, with URL parameters taking precedence over localStorage
- **FR-003**: System MUST compress `original` and `modified` parameter values using lz-string before URL encoding; `method` and `view` parameters remain uncompressed
- **FR-004**: System MUST use query parameter names: `original` (left text), `modified` (right text), `method` (comparison algorithm), `view` (display mode)
- **FR-005**: System MUST use default values when query parameters are missing or invalid
- **FR-006**: System MUST update the browser URL using replaceState (not pushState) to avoid polluting browser history
- **FR-007**: System MUST show a warning message when compressed state exceeds browser URL length limits
- **FR-008**: System MUST preserve all query string parameters when updating individual state values

### Key Entities _(include if feature involves data)_

- **Application State**: Represents the current configuration of the diff tool, specifically: original text (left), modified text (right), comparison method/algorithm, and view/display mode
- **Query Parameters**: Four key-value pairs in the URL query string:
  - `original`: Left-side diff text (lz-string compressed)
  - `modified`: Right-side diff text (lz-string compressed)
  - `method`: Comparison algorithm selection (uncompressed). Allowed values: `characters`, `words`, `lines`. Default: `words`
  - `view`: Display mode/layout option (uncompressed). Allowed values: `unified`, `side-by-side`. Default: `unified`

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can share their diff configuration by copying the URL, and recipients can restore the exact same state by navigating to that URL
- **SC-002**: URL updates occur within 300-500ms after user stops typing (debounced) to balance responsiveness with performance
- **SC-003**: Application successfully restores state from valid query parameters 100% of the time
- **SC-004**: Application handles invalid or missing query parameters gracefully without errors or broken functionality
- **SC-005**: Users can bookmark a configured state and return to it days later with all settings preserved
