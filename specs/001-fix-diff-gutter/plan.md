# Implementation Plan: Fix Line Numbers in Diff Gutter

**Branch**: `001-fix-diff-gutter` | **Date**: 2026-03-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-fix-diff-gutter/spec.md`

## Summary

Fix the unified diff view gutter to display actual source line numbers (original and modified) instead of sequential indices. The gutter must show two columns side-by-side with GitHub-style visual treatment (small gap, subtle divider, muted colors for missing numbers). This requires modifying the `LineNumberGutter` component to render dual line number columns from `DiffLine` metadata.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode)
**Primary Dependencies**: React 19, diff library (v8)
**Storage**: N/A (client-side only, no persistence)
**Testing**: Vitest 4 with @testing-library/react and @testing-library/user-event
**Target Platform**: Modern browsers (client-side SPA)
**Project Type**: Web application (static SPA, no backend)
**Performance Goals**: Instant diff rendering, smooth scrolling alignment
**Constraints**: Client-side only, 100% test coverage required, accessibility compliant
**Scale/Scope**: Single feature modification to existing diff viewer component

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                     | Status  | Notes                                             |
| ----------------------------- | ------- | ------------------------------------------------- |
| I. Client-Side Only           | ✅ PASS | Feature is UI-only, no backend changes            |
| II. Full Test Coverage        | ✅ PASS | New tests required for modified component         |
| III. Accessibility First      | ✅ PASS | Gutter already aria-hidden, no changes needed     |
| IV. Type Safety               | ✅ PASS | Using existing `DiffLine` type with strict types  |
| V. Simplicity and Performance | ✅ PASS | Modifying existing component, no new dependencies |

**Verdict**: All gates pass. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-fix-diff-gutter/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no external interfaces)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── LineNumberGutter/
│   │   ├── LineNumberGutter.tsx      # Modified for dual-column display
│   │   ├── LineNumberGutter.types.ts # May need type updates
│   │   └── LineNumberGutter.test.tsx # Updated tests
│   └── DiffViewer/
│       ├── DiffViewer.tsx            # May need integration updates
│       └── DiffViewer.test.tsx       # Updated tests
├── hooks/
│   └── useDiff.ts                     # Existing hook (no changes expected)
└── utils/
    └── segmentsToLines.ts             # Existing utility (no changes expected)

tests/
# Integrated with component test files (co-located)
```

**Structure Decision**: Co-located test files with components (existing project convention). No new directories needed.

## Complexity Tracking

No constitution violations. No complexity tracking required.
