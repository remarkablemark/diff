<!--
  Sync Impact Report
  ==================
  Version change: N/A → 1.0.0 (initial ratification)
  Modified principles: N/A (all new)
  Added sections:
    - Core Principles (5 principles)
    - Technology Constraints
    - Development Workflow
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ aligned (Constitution Check section present)
    - .specify/templates/spec-template.md ✅ aligned (mandatory sections match principles)
    - .specify/templates/tasks-template.md ✅ aligned (test-first ordering present)
    - .specify/templates/checklist-template.md ✅ aligned (generic structure)
  Follow-up TODOs: None
-->

# Diff Constitution

## Core Principles

### I. Client-Side Only

All logic MUST execute in the browser. This application is a static
single-page React app with zero backend dependencies. No server-side
processing, no API calls, and no external data persistence are permitted.
Build output MUST be deployable to any static hosting provider.

**Rationale**: A diff checker is a developer utility that operates on
user-provided text. Keeping it client-side ensures privacy (no data
leaves the browser), eliminates infrastructure costs, and enables
offline use after initial load.

### II. Full Test Coverage (NON-NEGOTIABLE)

Every component, utility, and feature MUST have 100% test coverage
across statements, branches, functions, and lines. Tests MUST use
Testing Library with user-event for interaction simulation. Vitest
globals are the test runner. No code merges with failing tests or
coverage below 100%.

**Rationale**: The AGENTS.md contract and CI pipeline (`npm run test:ci`)
enforce 100% coverage. This is a hard gate — not aspirational.

### III. Accessibility First

All interactive elements MUST be keyboard-navigable and screen-reader
compatible. Semantic HTML elements MUST be used (button, main, nav,
textarea, label). ARIA attributes MUST be applied where semantic HTML
alone is insufficient. Color MUST NOT be the sole means of conveying
diff information.

**Rationale**: A diff checker is a developer tool used by people with
diverse abilities. Accessibility is a functional requirement, not a
polish item.

### IV. Type Safety

TypeScript strict mode MUST be enabled with no escape hatches. All
component props MUST be defined with explicit interfaces. No `any`
types are permitted. Type checking (`npm run lint:tsc`) MUST pass
before any merge.

**Rationale**: Strict typing catches diff-logic edge cases at compile
time (empty inputs, mismatched line counts, encoding issues) and
serves as living documentation for component contracts.

### V. Simplicity and Performance

Start with the simplest implementation that satisfies requirements.
No premature abstractions, no state management libraries unless
justified by measured complexity. Components MUST remain small and
focused. Tailwind CSS is the sole styling approach — no custom CSS
files unless explicitly justified. Bundle size MUST remain minimal
for fast initial load.

**Rationale**: A diff checker has a bounded feature set. YAGNI
applies aggressively. Users expect instant interaction with pasted
text — unnecessary complexity degrades both DX and UX.

## Technology Constraints

The following stack is fixed and MUST NOT be changed without a
constitution amendment:

- **UI Library**: React 19 (functional components only, React Compiler enabled)
- **Language**: TypeScript 5 (strict mode)
- **Build Tool**: Vite 7
- **Test Framework**: Vitest 4 with @testing-library/react and @testing-library/user-event
- **Styling**: Tailwind CSS 4 (utility classes only)
- **Linting**: ESLint 9 with typescript-eslint, simple-import-sort, react-hooks, tsdoc
- **Formatting**: Prettier with Tailwind plugin
- **Node**: 24 (per .nvmrc)
- **Module System**: ESM only (`"type": "module"`)

Adding new runtime dependencies MUST be justified against the
Simplicity principle. Dev dependencies for tooling are permitted
with less scrutiny.

## Development Workflow

All code changes MUST pass these quality gates before merge:

1. **Lint**: `npm run lint` — zero errors, zero warnings
2. **Type Check**: `npm run lint:tsc` — zero errors
3. **Tests**: `npm run test:ci` — all pass with 100% coverage
4. **Build**: `npm run build` — clean production build

Commit messages MUST follow Conventional Commits (enforced by
commitlint via Husky pre-commit hooks). lint-staged runs on
every commit to enforce formatting and linting on staged files.

Import order MUST follow simple-import-sort convention:

1. External libraries
2. Internal absolute imports (`src/`)
3. Relative imports

File organization MUST follow the established pattern:

```
src/components/ComponentName/
├── ComponentName.tsx
├── ComponentName.types.ts (if needed)
├── ComponentName.test.tsx
└── index.ts
```

## Governance

This constitution supersedes all ad-hoc practices. Every pull
request and code review MUST verify compliance with these
principles. Violations MUST be documented and justified in the
PR description — unjustified violations block merge.

Amendments to this constitution require:

1. A documented rationale for the change
2. An updated version number following semver (MAJOR for
   principle removals/redefinitions, MINOR for additions,
   PATCH for clarifications)
3. An updated Sync Impact Report (HTML comment at top of file)
4. Propagation of changes to dependent templates

Runtime development guidance is maintained in `AGENTS.md` at the
repository root. The constitution defines principles; AGENTS.md
provides tactical instructions for AI-assisted development.

**Version**: 1.0.0 | **Ratified**: 2026-02-07 | **Last Amended**: 2026-02-07
