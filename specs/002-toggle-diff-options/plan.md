# Implementation Plan: Toggle Diff Options

**Branch**: `002-toggle-diff-options` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-toggle-diff-options/spec.md`

## Summary

Add a segmented button group (Characters | Words | Lines) to the diff header that lets users switch between `diffChars`, `diffWords`, and `diffLines` from the `diff` npm library. The selected method and view mode are persisted to localStorage. The diff method toggle is placed on the left side of the diff header; the existing view mode toggle stays on the right. State is lifted in the `App` component following the existing `viewMode` pattern. A new `useLocalStorage` hook provides persistence with type-safe fallback defaults.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode)
**Primary Dependencies**: React 19, `diff` npm package (already installed — exports `diffChars`, `diffWords`, `diffLines`)
**Storage**: localStorage (browser-native, no new dependencies)
**Testing**: Vitest 4 with @testing-library/react and @testing-library/user-event
**Target Platform**: Browser (static SPA, any modern browser)
**Project Type**: Single-page web application
**Performance Goals**: Instant recomputation on method change (no debounce)
**Constraints**: Client-side only, 100% test coverage, no new runtime dependencies
**Scale/Scope**: 3 new/modified components, 1 new hook, 1 type addition

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                     | Status  | Notes                                                                                                                              |
| ----------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| I. Client-Side Only           | ✅ PASS | localStorage is browser-native, no server calls                                                                                    |
| II. Full Test Coverage        | ✅ PASS | All new code will have 100% coverage                                                                                               |
| III. Accessibility First      | ✅ PASS | Segmented button group uses `role="group"`, `aria-label`, native `<button>` elements                                               |
| IV. Type Safety               | ✅ PASS | `DiffMethod` type added to `src/types/diff.ts`, strict props interfaces                                                            |
| V. Simplicity and Performance | ✅ PASS | No new runtime dependencies; `useLocalStorage` is a thin wrapper around `useState` + `localStorage`; no state management libraries |

No violations. No complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/002-toggle-diff-options/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── types/
│   └── diff.ts                          # Add DiffMethod type
├── hooks/
│   ├── useLocalStorage.ts               # NEW: generic localStorage persistence hook
│   ├── useLocalStorage.test.ts          # NEW: tests
│   └── useDiff.ts                       # MODIFY: accept DiffMethod param, dispatch to diffChars/diffWords/diffLines
├── components/
│   ├── App/
│   │   ├── App.tsx                      # MODIFY: add diffMethod state with useLocalStorage, wire to DiffMethodToggle and useDiff; migrate viewMode to useLocalStorage
│   │   └── App.test.tsx                 # MODIFY: add tests for diff method switching and localStorage persistence
│   ├── DiffMethodToggle/                # NEW component
│   │   ├── DiffMethodToggle.tsx
│   │   ├── DiffMethodToggle.types.ts
│   │   ├── DiffMethodToggle.test.tsx
│   │   └── index.ts
│   └── ViewToggle/
│       └── (no changes)
```

**Structure Decision**: Single-project structure following existing `src/components/` and `src/hooks/` conventions. New `DiffMethodToggle` component follows the established `ComponentName/` directory pattern. No contracts directory needed (no APIs).
