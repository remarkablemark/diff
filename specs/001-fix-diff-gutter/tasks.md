# Tasks: Fix Line Numbers in Diff Gutter

**Input**: Design documents from `/specs/001-fix-diff-gutter/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Tests are REQUIRED per Constitution Principle II (Full Test Coverage)

**Organization**: Tasks are grouped by implementation phase

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing project structure and dependencies

- [x] T001 Verify project dependencies installed (npm install)
- [x] T002 Confirm existing test infrastructure works (npm run test:ci)

---

## Phase 2: Implementation - Unified View Grid Restructure

**Goal**: Restructure unified diff view to use CSS grid rows where each row contains both line number and content as sibling cells

### Implementation

- [x] T003 Update DiffViewer.tsx to restructure unified view rendering
  - Remove separate LineNumberGutter component usage for unified view
  - Change grid structure to render line numbers inline as first column of each row
  - Each diff line renders as Fragment with two div children (line number cell + content cell)
  - Use `grid-cols-[auto_1fr]` for two-column layout
- [x] T004 Implement line number cell styling
  - Right-aligned with `text-right` and `pr-2`
  - Monospace font with `font-mono`
  - Background colors matching content (red/green/white)
- [x] T005 Implement content cell styling
  - Left-aligned with `pl-2`
  - Monospace font with `font-mono`
  - Preserve +/- prefix with separate span elements
- [x] T006 Remove unused scroll sync logic from unified view
  - Remove `enableScrollSync` prop usage (no longer needed with inline line numbers)
  - Remove `handleContentScroll` callback
  - Remove `scrollPosition` state
- [x] T007 Update SideBySideGutter to remove scrollTop prop
  - Remove `scrollTop` prop from component signature
  - Remove scroll sync useEffect

### Tests

- [x] T008 Update DiffViewer.test.tsx tests for new grid structure
  - Update tests to query for grid cells instead of separate gutter
  - Update line number assertions to use `:nth-child(odd)` selector
  - Update scroll sync tests to use grid container instead of `.overflow-x-auto`
- [x] T009 Update App.test.tsx tests for new grid structure
  - Update gutter tests to query for grid structure
  - Update line number assertions

---

## Phase 3: Polish & Validation

**Purpose**: Ensure code quality and completeness

- [x] T010 Run full test suite and verify all tests pass (npm run test)
- [x] T011 Run lint and type check (npm run lint && npm run lint:tsc)
- [x] T012 Run build to verify production build succeeds (npm run build)
- [x] T013 Fix React key warning by using Fragment with proper key
- [x] T014 Code cleanup: remove unused imports (LineNumberGutter, useCallback, useState)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Implementation)**: Depends on Phase 1 completion
- **Phase 3 (Polish)**: Depends on Phase 2 completion

### Implementation Notes

- The key insight is that line numbers and content must be in the same grid row to share height
- Using CSS `grid-cols-[auto_1fr]` creates automatic height matching
- Line numbers are rendered inline, eliminating the need for a separate gutter component
- This approach is simpler and more robust than trying to sync heights between separate elements

---

## Completed Implementation Summary

**Files Modified**:
- `src/components/DiffViewer/DiffViewer.tsx` - Restructured unified view rendering
- `src/components/DiffViewer/DiffViewer.test.tsx` - Updated tests for new structure
- `src/components/App/App.test.tsx` - Updated tests for new structure
- `src/components/SideBySideGutter/SideBySideGutter.tsx` - Removed scroll sync
- `src/components/SideBySideGutter/SideBySideGutter.test.tsx` - Updated tests
- `src/components/SideBySideGutter/SideBySideGutter.types.ts` - Removed scrollTop prop

**Key Changes**:
1. Unified view now renders line numbers inline as first column of grid rows
2. Each row is a Fragment containing: `<div>line number</div>` + `<div>content</div>`
3. Grid structure ensures automatic height matching between line numbers and content
4. Removed unused scroll synchronization logic
5. All tests updated and passing
