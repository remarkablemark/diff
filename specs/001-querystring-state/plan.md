# Implementation Plan: Query String State Persistence

**Branch**: `001-querystring-state` | **Date**: 2026-03-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-querystring-state/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement URL query string-based state persistence for the diff tool, enabling users to share and bookmark diff configurations. The application will encode diff texts (using lz-string compression), comparison method, and view mode into URL parameters (`original`, `modified`, `method`, `view`). URL updates will be debounced (300-500ms) and use `replaceState` to avoid history pollution. URL parameters take precedence over localStorage, ensuring shared links restore exact configurations.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5 (strict mode)
**Primary Dependencies**: React 19, lz-string (compression library)
**Storage**: Browser URL query string (primary), localStorage (fallback for defaults)
**Testing**: Vitest 4 with @testing-library/react and @testing-library/user-event
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Static single-page web application
**Performance Goals**: URL updates within 300-500ms after user stops typing, <100ms decompression on page load
**Constraints**: Client-side only (no backend), URL length limits (2000-8000 chars browser-dependent), 100% test coverage required
**Scale/Scope**: Single-feature enhancement to existing diff tool, 4 query parameters, 2 compression scenarios

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Principle I: Client-Side Only ✅

**Status**: PASS
**Verification**: Feature uses browser APIs only (History API, URLSearchParams, lz-string runs in browser). No server calls required.

### Principle II: Full Test Coverage ✅

**Status**: PASS (pending implementation)
**Verification**: All new utilities (URL encoding/decoding, compression, debouncing) and component changes will have 100% coverage. Test plan includes edge cases for invalid URLs, compression failures, and debounce timing.

### Principle III: Accessibility First ✅

**Status**: PASS
**Verification**: Feature is transparent to accessibility - URL changes don't affect screen readers or keyboard navigation. Existing accessible components remain unchanged.

### Principle IV: Type Safety ✅

**Status**: PASS (pending implementation)
**Verification**: All query parameter handling will use strict TypeScript interfaces. URLSearchParams integration will be fully typed.

### Principle V: Simplicity and Performance ✅

**Status**: PASS
**Verification**: Single new dependency (lz-string, ~3KB). Uses standard browser APIs. Debouncing prevents excessive updates. No state management library needed.

### Technology Constraints ✅

**Status**: PASS
**Verification**: lz-string is the only new runtime dependency, justified for URL compression (standard practice for this use case). All other tech stack remains unchanged.

**Overall Gate Status**: ✅ PASS - No violations, proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── components/
│   └── App/                    # Update to integrate URL state sync
├── hooks/
│   ├── useDiff.ts             # Existing (no changes)
│   ├── useLocalStorage.ts     # Existing (no changes)
│   └── useQueryState.ts       # NEW: Custom hook for URL state management
├── types/
│   └── diff.ts                # Existing (may add QueryState type)
└── utils/
    ├── queryString.ts         # NEW: URL encoding/decoding utilities
    └── compression.ts         # NEW: lz-string wrapper utilities

tests/ (colocated with source files)
├── components/App/App.test.tsx          # Update with URL state tests
├── hooks/useQueryState.test.ts          # NEW: Test hook behavior
├── utils/queryString.test.ts            # NEW: Test URL utilities
└── utils/compression.test.ts            # NEW: Test compression
```

**Structure Decision**: Single project structure (existing). New utilities in `src/utils/`, new custom hook in `src/hooks/`. Tests colocated per existing pattern. No new top-level directories needed.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
