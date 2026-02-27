---
description: 'Task list for Fix Line Number Scrolling feature implementation'
---

# Tasks: Fix Line Number Scrolling

**Input**: Design documents from `/specs/001-fix-line-number-scrolling/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: 100% test coverage required per project constitution - includes unit tests for all components and hooks

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create component directories per implementation plan in src/components/LineNumberGutter/
- [x] T002 [P] Verify existing project structure and dependencies are compatible with new components

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create TypeScript interfaces for scroll synchronization in src/hooks/useScrollSync.ts
- [x] T004 [P] Create LineNumberGutter component types in src/components/LineNumberGutter/LineNumberGutter.types.ts
- [x] T005 [P] Create enhanced DiffViewer component types in src/components/DiffViewer/DiffViewer.types.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Synchronized Line Number Scrolling (Priority: P1) 🎯 MVP

**Goal**: Implement synchronized scrolling between line numbers and diff content using linked scroll containers

**Independent Test**: Create a diff with many lines, scroll vertically to verify line numbers stay aligned with their corresponding content

### Tests for User Story 1 (REQUIRED - 100% coverage) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T006 [P] [US1] Unit test for useScrollSync hook scroll event handling in src/hooks/useScrollSync.test.ts
- [x] T007 [P] [US1] Unit test for LineNumberGutter component rendering in src/components/LineNumberGutter/LineNumberGutter.test.tsx
- [x] T008 [P] [US1] Unit test for scroll synchronization logic in src/components/LineNumberGutter/LineNumberGutter.test.tsx
- [ ] T009 [P] [US1] Integration test for DiffViewer with scroll sync in src/components/DiffViewer/DiffViewer.test.tsx

### Implementation for User Story 1

- [x] T010 [US1] Implement useScrollSync hook with scroll event coordination in src/hooks/useScrollSync.ts
- [x] T011 [P] [US1] Create LineNumberGutter component with basic structure in src/components/LineNumberGutter/LineNumberGutter.tsx
- [x] T012 [US1] Implement scroll event handlers in LineNumberGutter component in src/components/LineNumberGutter/LineNumberGutter.tsx
- [x] T013 [US1] Add Tailwind CSS styling for gutter layout in src/components/LineNumberGutter/LineNumberGutter.tsx
- [x] T014 [US1] Implement dynamic width calculation (2-3 digits) in src/components/LineNumberGutter/LineNumberGutter.tsx
- [x] T015 [US1] Create LineNumberGutter barrel export in src/components/LineNumberGutter/index.ts
- [ ] T016 [US1] Enhance DiffViewer component to integrate LineNumberGutter in src/components/DiffViewer/DiffViewer.tsx
- [ ] T017 [US1] Apply useScrollSync hook in DiffViewer component in src/components/DiffViewer/DiffViewer.tsx
- [ ] T018 [US1] Add CSS Grid layout for gutter and content in src/components/DiffViewer/DiffViewer.tsx
- [ ] T019 [US1] Implement horizontal scroll synchronization in src/components/DiffViewer/DiffViewer.tsx
- [ ] T020 [US1] Add accessibility attributes and ARIA labels in src/components/DiffViewer/DiffViewer.tsx
- [ ] T021 [US1] Update DiffViewer barrel export in src/components/DiffViewer/index.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Responsive Line Number Display (Priority: P2)

**Goal**: Ensure line numbers display properly across different viewport sizes and devices

**Independent Test**: View the same diff on different viewport sizes and verify line numbers remain visible and properly formatted

### Tests for User Story 2 (REQUIRED - 100% coverage) ⚠️

- [ ] T022 [P] [US2] Unit test for responsive width calculation in src/components/LineNumberGutter/LineNumberGutter.test.tsx
- [ ] T023 [P] [US2] Integration test for viewport resizing behavior in src/components/DiffViewer/DiffViewer.test.tsx

### Implementation for User Story 2

- [ ] T024 [US2] Implement responsive width calculation for different viewport sizes in src/components/LineNumberGutter/LineNumberGutter.tsx
- [ ] T025 [US2] Add viewport resize handling in useScrollSync hook in src/hooks/useScrollSync.ts
- [ ] T026 [US2] Implement Tailwind responsive classes for gutter layout in src/components/LineNumberGutter/LineNumberGutter.tsx
- [ ] T027 [US2] Add viewport size validation and edge case handling in src/components/DiffViewer/DiffViewer.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T028 [P] Performance optimization for large diff files in src/hooks/useScrollSync.ts
- [ ] T029 [P] Error handling and graceful degradation in src/components/LineNumberGutter/LineNumberGutter.tsx
- [ ] T030 [P] Memory cleanup and event listener management in src/hooks/useScrollSync.ts
- [ ] T031 Add comprehensive accessibility testing in src/components/DiffViewer/DiffViewer.test.tsx
- [ ] T032 [P] Documentation updates for component APIs in src/components/LineNumberGutter/LineNumberGutter.tsx
- [ ] T033 Code cleanup and refactoring for maintainability
- [ ] T034 Final validation against success criteria (SC-001 through SC-005)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 components for integration

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Types before implementation
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for useScrollSync hook scroll event handling in src/hooks/useScrollSync.test.ts"
Task: "Unit test for LineNumberGutter component rendering in src/components/LineNumberGutter/LineNumberGutter.test.tsx"
Task: "Unit test for scroll synchronization logic in src/components/LineNumberGutter/LineNumberGutter.test.tsx"
Task: "Integration test for DiffViewer with scroll sync in src/components/DiffViewer/DiffViewer.test.tsx"

# Launch component types in parallel:
Task: "Create LineNumberGutter component types in src/components/LineNumberGutter/LineNumberGutter.types.ts"
Task: "Create enhanced DiffViewer component types in src/components/DiffViewer/DiffViewer.types.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Verify all success criteria (SC-001 through SC-005)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Validate MVP
3. Add User Story 2 → Test independently → Full feature set
4. Each story adds value without breaking previous stories

### Quality Gates

Before completing each phase, ensure:

- **Lint**: `npm run lint` - zero errors, zero warnings
- **Type Check**: `npm run lint:tsc` - zero errors
- **Tests**: `npm run test:ci` - all pass with 100% coverage
- **Build**: `npm run build` - clean production build

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tailwind CSS only - no custom CSS files per project constitution
- TypeScript strict mode enforced - no `any` types
- 100% test coverage required - no exceptions
