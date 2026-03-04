# Tasks: Fix Line Numbers in Diff Gutter

**Input**: Design documents from `/specs/001-fix-diff-gutter/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Tests are REQUIRED per Constitution Principle II (Full Test Coverage)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing project structure and dependencies

- [ ] T001 Verify project dependencies installed (npm install)
- [ ] T002 Confirm existing test infrastructure works (npm run test:ci)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Update LineNumberGutterProps interface in src/components/LineNumberGutter/LineNumberGutter.types.ts
  - Add `lines: DiffLine[]` prop
  - Add `viewMode?: 'unified' | 'side-by-side'` prop
  - Remove `lineCount` prop (replaced by lines.length)
  - Remove `digitCount` prop (computed internally)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Correct Line Numbers in Unified Diff View (Priority: P1) 🎯 MVP

**Goal**: Unified view gutter displays dual columns with actual source line numbers (original | modified) using GitHub-style visual treatment

**Independent Test**: Paste two multi-line texts with additions/removals, verify gutter shows correct line numbers matching source positions

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T004 [P] [US1] Add test: removed line shows original number, blank modified in src/components/LineNumberGutter/LineNumberGutter.test.tsx
- [ ] T005 [P] [US1] Add test: added line shows blank original, modified number in src/components/LineNumberGutter/LineNumberGutter.test.tsx
- [ ] T006 [P] [US1] Add test: unchanged line shows both numbers side-by-side in src/components/LineNumberGutter/LineNumberGutter.test.tsx
- [ ] T007 [US1] Add test: line numbers offset correctly after lines added at beginning in src/components/LineNumberGutter/LineNumberGutter.test.tsx
- [ ] T008 [US1] Add test: line numbers offset correctly after lines removed from middle in src/components/LineNumberGutter/LineNumberGutter.test.tsx
- [ ] T008b [US1] Add test: empty text edge case (one text empty) in src/components/LineNumberGutter/LineNumberGutter.test.tsx
- [ ] T008c [US1] Add test: consecutive added/removed lines edge case in src/components/LineNumberGutter/LineNumberGutter.test.tsx

### Implementation for User Story 1

- [ ] T009 [P] [US1] Update LineNumberGutter component signature in src/components/LineNumberGutter/LineNumberGutter.tsx
  - Accept `lines: DiffLine[]` prop
  - Accept `viewMode` prop
  - Remove `lineCount` and `digitCount` props
- [ ] T010 [P] [US1] Compute digitCount internally from lines array in src/components/LineNumberGutter/LineNumberGutter.tsx
- [ ] T011 [US1] Implement dual-column gutter rendering with CSS grid in src/components/LineNumberGutter/LineNumberGutter.tsx
  - Left column: original line numbers
  - Right column: modified line numbers
  - Small gap with subtle vertical divider
  - Muted color for empty/missing numbers
- [ ] T012 [US1] Handle removed lines (original number, blank modified) in src/components/LineNumberGutter/LineNumberGutter.tsx
- [ ] T013 [US1] Handle added lines (blank original, modified number) in src/components/LineNumberGutter/LineNumberGutter.tsx
- [ ] T014 [US1] Handle unchanged lines (both numbers) in src/components/LineNumberGutter/LineNumberGutter.tsx
- [ ] T015 [US1] Update DiffViewer to pass lines prop to LineNumberGutter in src/components/DiffViewer/DiffViewer.tsx
  - Remove separate gutters for lines diff method (no longer needed)
- [ ] T016 [US1] Add integration tests for unified view line numbers in src/components/DiffViewer/DiffViewer.test.tsx
  - Test all 5 acceptance scenarios from spec.md

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Correct Line Numbers in Side-by-Side Diff View (Priority: P2)

**Goal**: Side-by-side view columns display correct source line numbers consistently with unified view

**Independent Test**: Switch to side-by-side view with texts that have additions/removals, verify each column shows correct line numbers

### Tests for User Story 2 ⚠️

- [ ] T017 [P] [US2] Add test: side-by-side removed line shows correct original number in src/components/DiffViewer/DiffViewer.test.tsx
- [ ] T018 [P] [US2] Add test: side-by-side added line shows correct modified number in src/components/DiffViewer/DiffViewer.test.tsx
- [ ] T019 [US2] Add test: side-by-side unchanged line shows correct numbers in both columns in src/components/DiffViewer/DiffViewer.test.tsx

### Implementation for User Story 2

- [ ] T020 [US2] Verify side-by-side gutter uses correct line number properties in src/components/DiffViewer/DiffViewer.tsx
  - Original column: `pair.original?.originalLineNumber`
  - Modified column: `pair.modified?.modifiedLineNumber`
- [ ] T021 [US2] Apply GitHub-style visual treatment to side-by-side gutters in src/components/DiffViewer/DiffViewer.tsx
  - Subtle vertical divider between columns
  - Muted color for empty cells
- [ ] T022 [US2] Ensure placeholder rows have no line numbers in src/components/DiffViewer/DiffViewer.tsx
  - Removed lines: blank placeholder in modified column
  - Added lines: blank placeholder in original column

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T023 [P] Run full test suite and verify 100% coverage maintained (npm run test:ci)
- [ ] T024 Run lint and type check (npm run lint && npm run lint:tsc)
- [ ] T025 Run build to verify production build succeeds (npm run build)
- [ ] T026 Manual testing: verify all acceptance scenarios from spec.md
- [ ] T027 Manual testing: compare visual appearance against GitHub diff view
- [ ] T028 [P] Verify accessibility: gutter remains aria-hidden, content has aria-live
- [ ] T029 Code cleanup: remove unused imports and variables
- [ ] T030 Update quickstart.md with any new manual testing scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1 but shares foundational types

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Component signature updates before implementation
- Core rendering logic before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel
- **Phase 2**: T003 is standalone (blocks all stories)
- **Phase 3 (US1)**:
  - T004, T005, T006 (tests) can run in parallel
  - T009, T010 (component signature) can run in parallel
  - T011, T012, T013, T014 (rendering logic) should be sequential
- **Phase 4 (US2)**:
  - T017, T018, T019 (tests) can run in parallel
  - T020, T021, T022 (implementation) should be sequential
- **Phase 5**: T023, T024, T025, T028 can run in parallel

---

## Parallel Example: User Story 1 Tests

```bash
# Launch all tests for User Story 1 together:
Task: "Add test: removed line shows original number, blank modified"
Task: "Add test: added line shows blank original, modified number"
Task: "Add test: unchanged line shows both numbers side-by-side"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**:
   - Run `npm run test:ci` - all tests pass, 100% coverage
   - Run `npm run lint` - zero errors
   - Run `npm run lint:tsc` - zero errors
   - Manual testing: verify all 5 acceptance scenarios from spec.md
5. Commit and create PR

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Single Developer Flow

1. T001-T003: Setup and foundation (30 min)
2. T004-T008: Write US1 tests first, watch them fail (45 min)
3. T009-T016: Implement US1, watch tests pass (2 hours)
4. T017-T019: Write US2 tests, watch them fail (30 min)
5. T020-T022: Implement US2, watch tests pass (1 hour)
6. T023-T030: Polish and validation (45 min)

**Total estimated time**: ~5-6 hours

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
