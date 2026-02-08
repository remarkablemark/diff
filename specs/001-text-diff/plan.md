# Implementation Plan: Text Diff Checker

**Branch**: `001-text-diff` | **Date**: 2026-02-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-text-diff/spec.md`

## Summary

Build a client-side text diff checker that lets users enter text in two `<textarea>` elements (side-by-side on desktop, stacked on mobile) and instantly see word-level differences rendered with color-coded highlights. The diff is computed using the `diff` npm library and displayed via custom React components styled with Tailwind CSS. Users can toggle between unified inline and side-by-side views on `md:` screens and above; on mobile, the diff defaults to unified view with the toggle hidden. Textareas have a fixed max height with internal scrolling. The app supports system-preference dark mode via `prefers-color-scheme`. Diff output updates on every keystroke with no debounce.

## Technical Context

**Language/Version**: TypeScript 5.9.3 (strict mode)
**Primary Dependencies**: React 19.2.4, `diff` (npm — to be added as runtime dependency)
**Storage**: N/A (client-side only, no persistence)
**Testing**: Vitest 4.0.18 with @testing-library/react 16.3.2 and @testing-library/user-event 14.6.1
**Target Platform**: Modern browsers (static SPA, deployable to any static host)
**Project Type**: Single-page web application (client-side only, no backend)
**Performance Goals**: Diff result within 2s for ≤1,000-line inputs; UI update within 500ms per keystroke; no frame drops >1s for inputs up to 10,000 lines
**Constraints**: Client-side only (no server calls), offline-capable after initial load, minimal bundle size
**Scale/Scope**: Single-screen application with 2 text inputs, 1 diff output area, 1 view toggle (hidden on mobile)
**Responsive**: Side-by-side on `md:` (768px+), stacked vertically below; fixed-height textareas with internal scroll
**Dark Mode**: System-preference via `prefers-color-scheme`; Tailwind `dark:` variants on all UI elements

## Constitution Check — Pre-Design

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                         | Status  | Notes                                                                                                                                                                                                                                                                                                            |
| --------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **I. Client-Side Only**           | ✅ PASS | No backend, no API calls, no external persistence. `diff` library runs in-browser. Static build output.                                                                                                                                                                                                          |
| **II. Full Test Coverage**        | ✅ PASS | All new components and utilities will have 100% coverage. Vitest + Testing Library + user-event.                                                                                                                                                                                                                 |
| **III. Accessibility First**      | ✅ PASS | Semantic HTML (`<textarea>`, `<label>`, `<button>`, `<main>`). ARIA attributes for diff output regions. Color is supplemented with `+`/`-` text markers so it is not the sole indicator. Keyboard-navigable toggle. Dark mode diff colors remain distinguishable. Responsive layout ensures usability on mobile. |
| **IV. Type Safety**               | ✅ PASS | Strict mode enabled. All props via explicit interfaces. No `any`.                                                                                                                                                                                                                                                |
| **V. Simplicity and Performance** | ✅ PASS | No state management library — `useState` only. No external diff rendering library. Tailwind-only styling (including `dark:` and responsive prefixes). Single new runtime dependency (`diff`) justified by spec requirement FR-002.                                                                               |
| **Technology Constraints**        | ✅ PASS | Stack matches constitution exactly. One new runtime dep (`diff`) justified per spec clarification.                                                                                                                                                                                                               |
| **Development Workflow**          | ✅ PASS | All quality gates (lint, tsc, test:ci, build) will be enforced.                                                                                                                                                                                                                                                  |

**Gate result: PASS** — no violations, proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-text-diff/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── App/
│   │   ├── App.tsx              # Root component (updated to compose diff UI)
│   │   ├── App.test.tsx         # Root component tests (updated)
│   │   └── index.ts             # Barrel export
│   ├── TextInput/
│   │   ├── TextInput.tsx        # Textarea with line number gutter
│   │   ├── TextInput.types.ts   # Props interface
│   │   ├── TextInput.test.tsx   # Tests
│   │   └── index.ts             # Barrel export
│   ├── DiffViewer/
│   │   ├── DiffViewer.tsx       # Diff output container (unified + side-by-side)
│   │   ├── DiffViewer.types.ts  # Props/types for diff segments
│   │   ├── DiffViewer.test.tsx  # Tests
│   │   └── index.ts             # Barrel export
│   └── ViewToggle/
│       ├── ViewToggle.tsx       # Toggle between unified/side-by-side
│       ├── ViewToggle.types.ts  # Props interface
│       ├── ViewToggle.test.tsx  # Tests
│       └── index.ts             # Barrel export
├── hooks/
│   ├── useDiff.ts               # Hook wrapping diff library computation
│   ├── useDiff.test.ts          # Hook tests
│   ├── useMediaQuery.ts         # Hook for responsive breakpoint detection (FR-010)
│   └── useMediaQuery.test.ts    # Hook tests
├── types/
│   └── diff.ts                  # Shared diff types (DiffSegment, ViewMode, etc.)
├── index.css                    # Tailwind entry
├── main.tsx                     # React root
├── main.test.tsx                # Root render test
└── vite-env.d.ts                # Vite type declarations

test/
└── setupFiles.ts                # Test setup
```

**Structure Decision**: Single-project structure following the existing `src/components/ComponentName/` convention from the constitution and AGENTS.md. No backend, no multi-project layout. A `hooks/` directory is added for the `useDiff` hook, and `types/` for shared type definitions. No `contracts/` directory is needed since this is a pure client-side application with no API.

## Constitution Check — Post-Design

_Re-evaluation after Phase 1 design artifacts are complete._

| Principle                         | Status  | Notes                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **I. Client-Side Only**           | ✅ PASS | Design confirms: no API contracts needed, no persistence layer, all computation in-browser via `diffWords()`. Dark mode and responsive layout are pure CSS (Tailwind `dark:` and `md:` prefixes) — no server dependency.                                                                                                                                                                   |
| **II. Full Test Coverage**        | ✅ PASS | Every component (`TextInput`, `DiffViewer`, `ViewToggle`, `App`) and the `useDiff` hook have corresponding `.test.tsx`/`.test.ts` files in the source structure. 100% coverage enforced by `npm run test:ci`.                                                                                                                                                                              |
| **III. Accessibility First**      | ✅ PASS | Data model includes `label` prop on `TextInputProps`. Research documents `aria-live="polite"` for diff output, `role="status"` for no-diff message, `aria-hidden="true"` for line gutters, and `+`/`-` text markers alongside color. Responsive stacking ensures mobile usability. Dark mode diff colors (FR-011) must remain distinguishable — `dark:` variants for red/green highlights. |
| **IV. Type Safety**               | ✅ PASS | All types defined in `src/types/diff.ts` with explicit interfaces (`DiffSegment`, `DiffResult`, `ViewMode`). All component props have dedicated interfaces. No `any` types.                                                                                                                                                                                                                |
| **V. Simplicity and Performance** | ✅ PASS | Design uses only `useState` for state. No state management library. No virtualization (measure-first approach per research). Single new runtime dependency (`diff`). No custom CSS files. Responsive and dark mode handled entirely via Tailwind utility prefixes — no added complexity.                                                                                                   |
| **Technology Constraints**        | ✅ PASS | Only addition is `diff` npm package as runtime dependency, justified by FR-002. All other tech unchanged.                                                                                                                                                                                                                                                                                  |
| **Development Workflow**          | ✅ PASS | File organization follows `src/components/ComponentName/` convention. Implementation order in quickstart.md respects dependency chain. Dark mode and responsive tests included in component test files.                                                                                                                                                                                    |

**Post-design gate result: PASS** — no violations introduced during design.

## Complexity Tracking

> No constitution violations — this section is intentionally empty.

_No violations to justify._
