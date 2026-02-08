# Tasks: Diff Line Numbers

**Input**: Design documents from `/specs/003-diff-line-numbers/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Included — constitution mandates 100% test coverage (`npm run test:ci`).

**Organization**: Tasks are grouped by phase. US1 (unified view) is the MVP. US2 (side-by-side view) builds on the same infrastructure.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the `DiffLine` and `DiffLineResult` types and the pure `segmentsToLines` utility that all subsequent tasks depend on.

- [ ] T001 Add `DiffLine` interface and `DiffLineResult` interface (extends `DiffResult`) to src/types/diff.ts
- [ ] T002 [P] Write unit tests for `segmentsToLines` utility in src/utils/segmentsToLines.test.ts (unchanged lines, removed lines, added lines, mixed segments, multi-line segments split by `\n`, single-line input, empty segments, segments ending with newline)
- [ ] T003 [P] Implement `segmentsToLines` pure function in src/utils/segmentsToLines.ts (iterate segments, split by `\n`, track original/modified line counters, emit DiffLine per output line)

**Checkpoint**: `DiffLine` type exists, `segmentsToLines` is tested and working.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update `useDiff` to return `DiffLineResult` with a `lines` field computed via `segmentsToLines`. This MUST be complete before the UI can render line numbers.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Update `useDiff` hook to call `segmentsToLines` and return `DiffLineResult` (with `lines` field) in src/hooks/useDiff.ts
- [ ] T005 Update `useDiff` tests to verify `lines` output includes correct line numbers for all three diff methods in src/hooks/useDiff.test.ts
- [ ] T006 Update `DiffViewerProps` to accept `DiffLineResult` instead of `DiffResult` in src/components/DiffViewer/DiffViewer.types.ts

**Checkpoint**: `useDiff` returns line-based output with correct line numbers, `DiffViewer` types updated.

---

## Phase 3: User Story 1 — Line Numbers in Unified View (Priority: P1) 🎯 MVP

**Goal**: User sees a two-column line number gutter (original | modified) alongside each line of diff content in unified view.

**Independent Test**: Paste two multi-line texts with known differences, view the unified diff, and verify each line shows correct original/modified line numbers in the gutter. Removed lines show only original number, added lines show only modified number, unchanged lines show both.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T007 [P] [US1] Write unit tests for unified view line number rendering in src/components/DiffViewer/DiffViewer.test.tsx (gutter renders two columns with correct line numbers, removed lines show original number only, added lines show modified number only, unchanged lines show both, gutter is aria-hidden, gutter uses TextInput gutter styling classes)
- [ ] T008 [P] [US1] Write integration tests for unified view line numbers in src/components/App/App.test.tsx (line numbers appear when diff is displayed, line numbers correct across diff method changes)

### Implementation for User Story 1

- [ ] T009 [US1] Restructure unified view rendering in src/components/DiffViewer/DiffViewer.tsx from inline spans to row-based layout with two-column gutter (original | modified) using TextInput gutter style classes (`bg-gray-50 dark:bg-gray-800`, `text-right font-mono text-sm leading-6 text-gray-400 dark:text-gray-500`, `select-none`, `aria-hidden="true"`)
- [ ] T010 [US1] Update App component to pass `DiffLineResult` to `DiffViewer` in src/components/App/App.tsx (type change only — `useDiff` already returns the new type after T004)

**Checkpoint**: User Story 1 is fully functional — unified view shows line number gutters, all tests pass.

---

## Phase 4: User Story 2 — Line Numbers in Side-by-Side View (Priority: P2)

**Goal**: User sees line numbers in each column of the side-by-side view, with placeholder rows (faint gray background) for lines that don't exist on one side.

**Independent Test**: Paste two multi-line texts, switch to side-by-side view on desktop, and verify each column has its own line number gutter. Removed lines show a placeholder in the modified column, added lines show a placeholder in the original column.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T011 [P] [US2] Write unit tests for side-by-side line number rendering in src/components/DiffViewer/DiffViewer.test.tsx (each column has a gutter, original column shows original line numbers, modified column shows modified line numbers, placeholder rows have faint gray background and no line number, gutter is aria-hidden)
- [ ] T012 [P] [US2] Write integration tests for side-by-side line numbers in src/components/App/App.test.tsx (line numbers appear in side-by-side mode, placeholder rows render correctly)

### Implementation for User Story 2

- [ ] T013 [US2] Restructure side-by-side view rendering in src/components/DiffViewer/DiffViewer.tsx from inline spans to row-based layout with single-column gutter per side, placeholder rows with `bg-gray-100 dark:bg-gray-800` for missing lines

**Checkpoint**: User Stories 1 AND 2 both work independently — unified and side-by-side views both show line numbers.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass.

- [ ] T014 [P] Accessibility audit — verify `aria-hidden` on all gutters, keyboard tab order unaffected, screen reader does not announce line numbers
- [ ] T015 Run all quality gates: `npm run lint`, `npm run lint:tsc`, `npm run test:ci`, `npm run build`
- [ ] T016 Run quickstart.md validation — follow all steps in specs/003-diff-line-numbers/quickstart.md and verify they work end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (`DiffLine` type, `segmentsToLines`) — BLOCKS user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 (`useDiff` returning `DiffLineResult`)
- **User Story 2 (Phase 4)**: Depends on Phase 2 and shares rendering infrastructure with US1 (Phase 3)
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on US2
- **User Story 2 (P2)**: Should start after US1 (Phase 3) since both modify `DiffViewer.tsx` — avoids merge conflicts

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Type changes before component changes
- Component implementation before App integration

### Parallel Opportunities

- **Phase 1**: T002 (segmentsToLines tests) and T003 (segmentsToLines impl) can run in parallel after T001
- **Phase 3**: T007 (DiffViewer tests) and T008 (App tests) can run in parallel
- **Phase 4**: T011 (DiffViewer tests) and T012 (App tests) can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (DiffLine type + segmentsToLines)
2. Complete Phase 2: Foundational (useDiff returns DiffLineResult)
3. Complete Phase 3: User Story 1 (unified view line numbers)
4. **STOP and VALIDATE**: Test unified view line numbers independently
5. Complete Phase 4: User Story 2 (side-by-side view line numbers)
6. Complete Phase 5: Polish & quality gates

---

## Notes

- [P] tasks = different files, no dependencies
- [US1]/[US2] labels map tasks to User Stories for traceability
- No new runtime dependencies — `segmentsToLines` is a pure TypeScript function
- Existing `DiffViewer` tests will need updating since the rendering structure changes from inline spans to rows
- The `+`/`-` prefix on added/removed segments is preserved in the new row-based layout
- `segmentsToLines` is placed in `src/utils/` (new directory) since it's a pure function, not a hook or component
