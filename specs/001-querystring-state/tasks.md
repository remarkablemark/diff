# Tasks: Query String State Persistence

**Input**: Design documents from `/specs/001-querystring-state/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: This feature requires 100% test coverage per constitution. All test tasks are MANDATORY and must be written FIRST (TDD).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project structure: `src/`, tests colocated with source files
- Paths use absolute references from repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [x] T001 Install lz-string dependency via `npm install lz-string`
- [x] T002 Verify TypeScript types are available from lz-string package (check that `import { compress, decompress } from 'lz-string'` has type definitions and `npm run lint:tsc` passes)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Write tests for compression utilities in `src/utils/compression.test.ts`
- [x] T004 [P] Implement compression utilities in `src/utils/compression.ts` (compressText, decompressText)
- [x] T005 [P] Write tests for debounce utility in `src/utils/debounce.test.ts`
- [x] T006 [P] Implement debounce utility in `src/utils/debounce.ts`
- [x] T007 [P] Write tests for query string utilities in `src/utils/queryString.test.ts`
- [x] T008 [P] Implement query string utilities in `src/utils/queryString.ts` (encodeQueryState, decodeQueryState)
- [x] T009 Add QueryState interface to `src/types/diff.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Save Application State to URL (Priority: P1) 🎯 MVP

**Goal**: Automatically encode current application state into URL query string when settings change

**Independent Test**: Change any application setting (text, method, view), wait 500ms, verify URL updates with encoded parameters

### Tests for User Story 1 (MANDATORY - TDD Required)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Write tests for useQueryState hook (URL update behavior) in `src/hooks/useQueryState.test.ts`
- [ ] T011 [P] [US1] Write tests for App component URL sync in `src/components/App/App.test.tsx` (text changes trigger URL update)
- [ ] T012 [P] [US1] Write tests for App component URL sync in `src/components/App/App.test.tsx` (method changes trigger URL update)
- [ ] T013 [P] [US1] Write tests for App component URL sync in `src/components/App/App.test.tsx` (view changes trigger URL update)

### Implementation for User Story 1

- [ ] T014 [US1] Implement useQueryState hook in `src/hooks/useQueryState.ts` (state → URL encoding with debounce)
- [ ] T015 [US1] Update App component in `src/components/App/App.tsx` to use useQueryState for state management
- [ ] T016 [US1] Verify debounced URL updates (500ms delay) work correctly
- [ ] T017 [US1] Verify replaceState is used (not pushState) to avoid history pollution
- [ ] T018 [US1] Verify all parameters (original, modified, method, view) are encoded correctly
- [ ] T018a [US1] Write tests for preserving unrelated query parameters in `src/utils/queryString.test.ts` (verify existing params not overwritten during state updates)

**Checkpoint**: At this point, User Story 1 should be fully functional - changing any setting updates the URL

---

## Phase 4: User Story 2 - Load Application State from URL (Priority: P2)

**Goal**: Restore application state from URL query parameters on page load

**Independent Test**: Navigate to a URL with query parameters, verify all settings are restored correctly

### Tests for User Story 2 (MANDATORY - TDD Required)

- [ ] T019 [P] [US2] Write tests for useQueryState hook (URL → state restoration) in `src/hooks/useQueryState.test.ts`
- [ ] T020 [P] [US2] Write tests for App component in `src/components/App/App.test.tsx` (state restoration from URL on mount)
- [ ] T021 [P] [US2] Write tests for App component in `src/components/App/App.test.tsx` (URL params override localStorage)
- [ ] T022 [P] [US2] Write tests for App component in `src/components/App/App.test.tsx` (popstate events update state)

### Implementation for User Story 2

- [ ] T023 [US2] Implement URL reading on mount in useQueryState hook in `src/hooks/useQueryState.ts`
- [ ] T024 [US2] Implement localStorage fallback logic in useQueryState hook in `src/hooks/useQueryState.ts`
- [ ] T025 [US2] Implement popstate event listener in useQueryState hook in `src/hooks/useQueryState.ts` (back/forward navigation)
- [ ] T026 [US2] Verify URL parameters take precedence over localStorage values
- [ ] T027 [US2] Verify decompression works for original/modified parameters
- [ ] T028 [US2] Verify enum validation works for method/view parameters

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - save to URL and load from URL

---

## Phase 5: User Story 3 - Handle Invalid or Missing Parameters (Priority: P3)

**Goal**: Gracefully handle malformed, incomplete, or missing query parameters with sensible defaults

**Independent Test**: Navigate to URLs with various invalid parameter combinations, verify application loads without errors

### Tests for User Story 3 (MANDATORY - TDD Required)

- [ ] T029 [P] [US3] Write tests for query string utilities in `src/utils/queryString.test.ts` (missing parameters use defaults)
- [ ] T030 [P] [US3] Write tests for query string utilities in `src/utils/queryString.test.ts` (invalid enum values use defaults)
- [ ] T031 [P] [US3] Write tests for compression utilities in `src/utils/compression.test.ts` (corrupted data returns empty string)
- [ ] T032 [P] [US3] Write tests for App component in `src/components/App/App.test.tsx` (invalid URLs fall back to defaults)

### Implementation for User Story 3

- [ ] T033 [US3] Implement validation logic in decodeQueryState in `src/utils/queryString.ts`
- [ ] T034 [US3] Implement error handling in decompressText in `src/utils/compression.ts`
- [ ] T035 [US3] Verify empty URL (no parameters) loads with defaults
- [ ] T036 [US3] Verify corrupted compressed data is handled gracefully
- [ ] T037 [US3] Verify invalid method/view values fall back to defaults
- [ ] T038 [US3] Verify partial state (some params missing) works correctly

**Checkpoint**: All user stories should now be independently functional with robust error handling

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T039 [P] Write tests for URL length warning in `src/hooks/useQueryState.test.ts` (verify warning shown when URL exceeds 2000 chars)
- [ ] T039a [P] Implement URL length warning when compressed URL exceeds 2000 characters in `src/hooks/useQueryState.ts`
- [ ] T040 [P] Add barrel exports in `src/utils/index.ts` for new utilities
- [ ] T041 [P] Add barrel exports in `src/hooks/index.ts` for useQueryState
- [ ] T042 Verify 100% test coverage across all new files (`npm run test:ci`)
- [ ] T043 Run linting and fix any issues (`npm run lint:fix`)
- [ ] T044 Run type checking and fix any issues (`npm run lint:tsc`)
- [ ] T045 Verify production build succeeds (`npm run build`)
- [ ] T046 Manual testing per quickstart.md validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1 (can test URL loading without save functionality)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2 (can test error handling in isolation)

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Hook implementation before App component integration
- Core functionality before edge cases
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: Both setup tasks can run in parallel
- **Phase 2**: All foundational tasks marked [P] can run in parallel (different files)
  - T003 + T005 + T007 (all test files)
  - T004 + T006 + T008 (all implementation files)
- **Phase 3-5**: Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- **Within each story**: All test tasks marked [P] can run in parallel
- **Phase 6**: All polish tasks marked [P] can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch all test files together:
Task: "Write tests for compression utilities in src/utils/compression.test.ts"
Task: "Write tests for debounce utility in src/utils/debounce.test.ts"
Task: "Write tests for query string utilities in src/utils/queryString.test.ts"

# Then launch all implementations together (after tests fail):
Task: "Implement compression utilities in src/utils/compression.ts"
Task: "Implement debounce utility in src/utils/debounce.ts"
Task: "Implement query string utilities in src/utils/queryString.ts"
```

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Write tests for useQueryState hook (URL update behavior) in src/hooks/useQueryState.test.ts"
Task: "Write tests for App component URL sync (text changes) in src/components/App/App.test.tsx"
Task: "Write tests for App component URL sync (method changes) in src/components/App/App.test.tsx"
Task: "Write tests for App component URL sync (view changes) in src/components/App/App.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install lz-string)
2. Complete Phase 2: Foundational (all utilities and types)
3. Complete Phase 3: User Story 1 (save state to URL)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - users can now share URLs!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - save to URL works!)
3. Add User Story 2 → Test independently → Deploy/Demo (full save/load cycle works!)
4. Add User Story 3 → Test independently → Deploy/Demo (robust error handling!)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (save to URL)
   - Developer B: User Story 2 (load from URL)
   - Developer C: User Story 3 (error handling)
3. Stories complete and integrate independently

---

## Task Summary

**Total Tasks**: 46

**Tasks by Phase**:

- Phase 1 (Setup): 2 tasks
- Phase 2 (Foundational): 7 tasks
- Phase 3 (User Story 1): 9 tasks (4 tests + 5 implementation)
- Phase 4 (User Story 2): 10 tasks (4 tests + 6 implementation)
- Phase 5 (User Story 3): 10 tasks (4 tests + 6 implementation)
- Phase 6 (Polish): 8 tasks

**Parallel Opportunities**: 28 tasks marked [P] can run in parallel with others in their phase

**Independent Test Criteria**:

- US1: Change settings → URL updates (can test without load functionality)
- US2: Navigate to URL → Settings restored (can test without save functionality)
- US3: Invalid URL → Defaults loaded (can test without save/load functionality)

**Suggested MVP Scope**: Phases 1-3 only (Setup + Foundational + User Story 1)

- Delivers core value: users can share URLs with encoded state
- 18 tasks total
- Estimated effort: 4-6 hours

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD is mandatory**: Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- 100% test coverage required per constitution
- All new utilities must have barrel exports for clean imports
