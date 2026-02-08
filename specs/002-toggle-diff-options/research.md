# Research: Toggle Diff Options

**Feature Branch**: `002-toggle-diff-options`
**Date**: 2026-02-08

## Research Topic 1: `diff` Library — Multiple Diff Methods

### Decision

Use `diffChars`, `diffWords`, and `diffLines` from the `diff` npm package. All three are already available as named exports from the installed `diff` dependency.

### Rationale

- The `diff` library (jsdiff) provides a consistent API across all three methods: each returns an array of `Change` objects with `added`, `removed`, and `value` properties.
- No signature differences — all three accept `(oldStr, newStr)` and return `Change[]`.
- No new dependencies needed; the library is already installed.

### Alternatives Considered

- **Custom diff implementation**: Rejected — unnecessary complexity when the library already provides all three methods.
- **Separate libraries for each method**: Rejected — the `diff` package covers all granularities with a unified API.

## Research Topic 2: localStorage Persistence Hook

### Decision

Implement a custom `useLocalStorage<T>` hook that wraps `useState` with `localStorage` read/write. The hook reads the initial value from localStorage on mount (falling back to a provided default), and writes to localStorage on every state update.

### Rationale

- No new runtime dependencies needed — `localStorage` is a browser-native API.
- A generic hook (`useLocalStorage<T>`) can be reused for both `DiffMethod` and `ViewMode` persistence, and any future settings.
- The hook signature `useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void]` mirrors `useState` for drop-in replacement.
- JSON serialization/deserialization handles string union types cleanly.

### Alternatives Considered

- **Direct localStorage calls in App component**: Rejected — duplicates read/write logic for each persisted value; violates DRY.
- **Third-party hook library (e.g., usehooks-ts)**: Rejected — adds a runtime dependency; constitution principle V (Simplicity) favors no new dependencies for a thin wrapper.
- **URL query parameters**: Rejected — adds URL management complexity; localStorage is simpler for user preferences that don't need to be shareable.

### Implementation Notes

- The hook must handle invalid/corrupted localStorage values gracefully by falling back to the default.
- `localStorage` is synchronous and available in all target browsers.
- In tests, `localStorage` is available in jsdom — no special mocking needed beyond `localStorage.clear()` in cleanup.

## Research Topic 3: Segmented Button Group Pattern

### Decision

Create a new `DiffMethodToggle` component following the exact same pattern as the existing `ViewToggle` component: a `role="group"` container with `aria-label`, containing 3 native `<button>` elements with active/inactive styling via Tailwind classes.

### Rationale

- Reusing the proven pattern ensures UI consistency and reduces design decisions.
- Native `<button>` elements provide keyboard accessibility out of the box (Tab, Enter, Space).
- The 3-button variant only differs from the 2-button `ViewToggle` in having a middle button (no rounded corners on left or right).

### Alternatives Considered

- **Extending ViewToggle to be generic**: Rejected — the two toggles have different types (`ViewMode` vs `DiffMethod`) and different option counts. A generic component adds abstraction complexity without clear benefit for just 2 instances.
- **Dropdown/select**: Rejected per clarification — less discoverable than buttons.
- **Radio buttons**: Rejected per clarification — takes more vertical space.

### Styling Notes

- Left button: `rounded-l-md`
- Middle button: no border radius
- Right button: `rounded-r-md`
- Active state: `bg-blue-500 text-white dark:bg-blue-600`
- Inactive state: `bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600`
