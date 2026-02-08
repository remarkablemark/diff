# Implementation Plan: Diff Line Numbers

**Branch**: `003-diff-line-numbers` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-diff-line-numbers/spec.md`

## Summary

Add line number gutters to the diff output in both unified and side-by-side views. A new transformation layer converts flat `DiffSegment[]` into line-based `DiffLine[]` with original/modified line numbers. The `DiffViewer` component is restructured from inline spans to a row-based table layout with a two-column gutter (original | modified) in unified view and a single-column gutter per side in side-by-side view. Line numbers appear for all diff methods by splitting non-line segments at newline boundaries. The gutter reuses the existing `TextInput` gutter style for visual consistency.

## Technical Context

**Language/Version**: TypeScript 5, React 19  
**Primary Dependencies**: `diff` npm package (diffChars, diffWords, diffLines), React hooks  
**Storage**: N/A (client-side only)  
**Testing**: Vitest 4 with @testing-library/react and @testing-library/user-event  
**Target Platform**: Browser SPA, static hosting  
**Project Type**: Single-page React app  
**Performance Goals**: Instant recomputation on input change; line splitting adds negligible overhead  
**Constraints**: No new runtime dependencies, client-side only, 100% test coverage  
**Scale/Scope**: Typical diff inputs (1–10,000 lines)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                     | Status  | Notes                                                                                   |
| ----------------------------- | ------- | --------------------------------------------------------------------------------------- |
| I. Client-Side Only           | ✅ PASS | All logic runs in browser, no server calls                                              |
| II. Full Test Coverage        | ✅ PASS | 100% coverage required for all new/modified code                                        |
| III. Accessibility First      | ✅ PASS | Gutter is `aria-hidden`, diff content uses semantic markup, color is not sole indicator |
| IV. Type Safety               | ✅ PASS | New `DiffLine` interface with explicit types, strict mode                               |
| V. Simplicity and Performance | ✅ PASS | No new dependencies, pure transformation function, reuses existing patterns             |

## Project Structure

### Documentation (this feature)

```text
specs/003-diff-line-numbers/
├── plan.md              # This file
├── research.md          # Phase 0: line-splitting algorithm research
├── data-model.md        # Phase 1: DiffLine type, segmentsToLines transform
├── quickstart.md        # Phase 1: setup and development guide
└── tasks.md             # Phase 2: task breakdown (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── types/
│   └── diff.ts                          # MODIFY: add DiffLine interface
├── hooks/
│   ├── useDiff.ts                       # MODIFY: add line-based output
│   └── useDiff.test.ts                  # MODIFY: add line number tests
├── utils/
│   ├── segmentsToLines.ts               # NEW: transform DiffSegment[] → DiffLine[]
│   └── segmentsToLines.test.ts          # NEW: unit tests for transformation
├── components/
│   ├── DiffViewer/
│   │   ├── DiffViewer.tsx               # MODIFY: row-based rendering with gutters
│   │   ├── DiffViewer.types.ts          # MODIFY: accept DiffLine[] in props
│   │   └── DiffViewer.test.tsx          # MODIFY: add line number tests
│   └── App/
│       ├── App.tsx                      # MODIFY: pass lines to DiffViewer
│       └── App.test.tsx                 # MODIFY: integration tests for line numbers
```

**Structure Decision**: Single React SPA. New utility function in `src/utils/` for the pure transformation logic. No new component directories — line numbers are rendered within the existing `DiffViewer` component.

## Complexity Tracking

No constitution violations. No complexity justifications needed.
