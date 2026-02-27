# Implementation Plan: Fix Line Number Scrolling

**Branch**: `001-fix-line-number-scrolling` | **Date**: 2026-02-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-fix-line-number-scrolling/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement synchronized scrolling between line number gutter and textarea content using linked scroll containers with JavaScript scroll event coordination. The solution will preserve native textarea functionality while ensuring perfect alignment during vertical scrolling and handling horizontal scrolling when present. Line numbers will use monospace font with right-alignment, auto-sizing from 2 to 3 digits based on content length.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5 (strict mode)  
**Primary Dependencies**: React 19, Vite 7, Vitest 4, @testing-library/react, @testing-library/user-event  
**Storage**: N/A (client-side only)  
**Testing**: Vitest 4 with Testing Library and user-event  
**Target Platform**: Browser (static web application)  
**Project Type**: Single-page React web application  
**Performance Goals**: 0px misalignment tolerance, smooth 60fps scrolling  
**Constraints**: Client-side only, 100% test coverage, accessibility compliance, minimal bundle size  
**Scale/Scope**: Single component enhancement, viewport widths 320px-1920px

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

✅ **Client-Side Only**: Implementation uses browser-native scroll events and React components - no backend dependencies
✅ **Full Test Coverage**: Plan includes 100% test coverage requirement with Vitest and Testing Library
✅ **Accessibility First**: Preserves native textarea functionality, semantic HTML, keyboard navigation
✅ **Type Safety**: TypeScript strict mode with explicit interfaces for all components
✅ **Simplicity and Performance**: Minimal JavaScript scroll event coordination, no additional dependencies, Tailwind CSS only

**All constitution principles satisfied - no violations to justify**

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
│   ├── DiffViewer/
│   │   ├── DiffViewer.tsx
│   │   ├── DiffViewer.types.ts
│   │   ├── DiffViewer.test.tsx
│   │   └── index.ts
│   └── LineNumberGutter/
│       ├── LineNumberGutter.tsx
│       ├── LineNumberGutter.types.ts
│       ├── LineNumberGutter.test.tsx
│       └── index.ts
├── hooks/
│   ├── useScrollSync.ts
│   ├── useScrollSync.test.ts
│   └── [existing hooks...]
└── utils/
    └── [existing utils...]

test/
├── setupFiles.ts
└── [existing test setup...]
```

**Structure Decision**: Single React component enhancement within existing src/components structure. New LineNumberGutter component and useScrollSync hook will integrate with current DiffViewer component.

## Phase 0: Research ✅ COMPLETE

**Research Output**: [research.md](./research.md)

**Key Decisions Made**:

- Use native browser scroll events with `addEventListener` and passive listeners
- CSS Grid layout for perfect alignment between gutter and content
- Dynamic width calculation using CSS `ch` units with 2-3 digit range
- Performance optimization with `requestAnimationFrame` and debounced events
- Preserve native textarea accessibility with ARIA labels

**No NEEDS CLARIFICATION items remained** - all technical decisions resolved.

## Phase 1: Design ✅ COMPLETE

**Design Outputs**:

- **Data Model**: [data-model.md](./data-model.md) - Complete entity definitions and state management
- **API Contracts**: [contracts/component-apis.md](./contracts/component-apis.md) - Component interfaces and behavior contracts
- **Quickstart**: [quickstart.md](./quickstart.md) - Implementation guide and usage examples
- **Agent Context**: Updated Windsurf context with new technology details

**Design Validation**: Constitution Check passed - all principles satisfied with no violations.

## Next Steps

The planning phase is complete. Ready to proceed with task generation:

```bash
/speckit.tasks
```

This will create detailed implementation tasks based on the research and design artifacts generated above.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
