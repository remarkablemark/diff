# Tasks: Scroll to Top Button

**Input**: Design documents from `/specs/001-scroll-to-top/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: Included - 100% test coverage is required by constitution

**Organization**: Tasks are organized by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Include exact file paths in descriptions

## Path Conventions

Single project structure with tests co-located:

- `src/components/`, `src/hooks/`
- Tests alongside source files (`.test.tsx` / `.test.ts`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and tooling

- [ ] T001 Verify project structure matches plan (src/components/, src/hooks/)
- [ ] T002 Verify npm scripts available (lint, lint:tsc, test, build)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Create useScrollPosition hook in src/hooks/useScrollPosition.ts
- [ ] T004 [P] Create useScrollPosition test in src/hooks/useScrollPosition.test.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Scroll to Top from Bottom of Page (Priority: P1) 🎯 MVP

**Goal**: Implement core scroll-to-top functionality - button appears when scrolled, clicks scroll to top

**Independent Test**: User can scroll down, see button appear, click it, and page scrolls to top

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T005 [P] [US1] Create ScrollToTop component test file in src/components/ScrollToTop/ScrollToTop.test.tsx

### Implementation for User Story 1

- [ ] T006 [P] [US1] Create ScrollToTop component in src/components/ScrollToTop/ScrollToTop.tsx
- [ ] T007 [P] [US1] Create ScrollToTop types in src/components/ScrollToTop/ScrollToTop.types.ts
- [ ] T008 [P] [US1] Create index export in src/components/ScrollToTop/index.ts
- [ ] T009 [US1] Integrate ScrollToTop into App in src/components/App/App.tsx

**Checkpoint**: User Story 1 complete - core scroll-to-top functionality works

---

## Phase 4: User Story 2 - Responsive Visibility Based on Screen Size (Priority: P2)

**Goal**: Button only appears on screens ≥1280px (XL breakpoint)

**Independent Test**: On screens < 1280px button never appears; on screens ≥ 1280px button appears when scrolled

### Tests for User Story 2

- [ ] T010 [P] [US2] Add responsive visibility tests to ScrollToTop.test.tsx (hidden below XL, visible at XL)

### Implementation for User Story 2

- [ ] T011 [US2] Add responsive visibility (hidden xl:block) to ScrollToTop.tsx

**Checkpoint**: User Stories 1 AND 2 complete - responsive scroll-to-top works

---

## Phase 5: User Story 3 - Fixed Positioning & Accessibility (Priority: P3)

**Goal**: Button fixed at bottom-right (16px offset), circular (48px), WCAG 2.1 AA accessible

**Independent Test**: Button stays fixed while scrolling, keyboard accessible, proper ARIA labels, focus visible

### Tests for User Story 3

- [ ] T012 [P] [US3] Add accessibility tests to ScrollToTop.test.tsx (keyboard, ARIA, focus)
- [ ] T013 [P] [US3] Add positioning tests to ScrollToTop.test.tsx (fixed, bottom-right, circular)

### Implementation for User Story 3

- [ ] T014 [US3] Add fixed positioning and offset (fixed bottom-4 right-4) to ScrollToTop.tsx
- [ ] T015 [US3] Add circular shape (rounded-full h-12 w-12) to ScrollToTop.tsx
- [ ] T016 [US3] Add upward arrow icon (Unicode ▲) to ScrollToTop.tsx
- [ ] T017 [US3] Add hover states (cursor-pointer, bg change) to ScrollToTop.tsx
- [ ] T018 [US3] Add focus ring (focus:ring-2 focus:ring-blue-500) to ScrollToTop.tsx
- [ ] T019 [US3] Add ARIA label (aria-label="Scroll to top") to ScrollToTop.tsx
- [ ] T020 [US3] Add keyboard handler (onKeyDown for Enter/Space) to ScrollToTop.tsx
- [ ] T021 [US3] Add reduced motion support (prefers-reduced-motion) to ScrollToTop.tsx

**Checkpoint**: All user stories complete - fully accessible, responsive scroll-to-top button

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and quality gates

- [ ] T022 [P] Run lint: npm run lint (zero errors)
- [ ] T023 [P] Run type check: npm run lint:tsc (zero errors)
- [ ] T024 [P] Run tests with coverage: npm run test:ci (100% coverage required)
- [ ] T025 [P] Run production build: npm run build (clean build)
- [ ] T026 Verify all acceptance criteria from spec.md are met
- [ ] T027 Verify quickstart.md testing checklist passes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: No dependencies - creates the hook used by all stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories proceed sequentially (P1 → P2 → P3) - same component, incremental enhancements
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on T003-T004 (hook) - Core functionality
- **User Story 2 (P2)**: Depends on US1 complete - Adds responsive visibility
- **User Story 3 (P3)**: Depends on US2 complete - Adds positioning, styling, accessibility

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Component structure (types, component, index) before integration
- Core implementation before polish tasks
- Story complete before moving to next priority

### Parallel Opportunities

- **Foundational phase**: T003 (hook) and T004 (hook test) can run in parallel
- **US1 tests**: T005 can run in parallel with T006-T008 (component files)
- **US2 tests**: T010 can run in parallel with T011 (implementation)
- **US3 tests**: T012-T013 can run in parallel with T014-T021 (implementation tasks)
- **Polish phase**: T022-T025 can all run in parallel (separate commands)

---

## Parallel Example: Foundational Phase

```bash
# Launch hook and test together:
Task: "Create useScrollPosition hook in src/hooks/useScrollPosition.ts"
Task: "Create useScrollPosition test in src/hooks/useScrollPosition.test.ts"
```

---

## Parallel Example: User Story 3

```bash
# Launch all US3 tests together:
Task: "Add accessibility tests to ScrollToTop.test.tsx"
Task: "Add positioning tests to ScrollToTop.test.tsx"

# Launch all US3 implementation tasks together (different aspects of same file):
Task: "Add fixed positioning and offset to ScrollToTop.tsx"
Task: "Add circular shape to ScrollToTop.tsx"
Task: "Add upward arrow icon to ScrollToTop.tsx"
Task: "Add hover states to ScrollToTop.tsx"
Task: "Add focus ring to ScrollToTop.tsx"
Task: "Add ARIA label to ScrollToTop.tsx"
Task: "Add keyboard handler to ScrollToTop.tsx"
Task: "Add reduced motion support to ScrollToTop.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify structure)
2. Complete Phase 2: Foundational (create hook + test)
3. Complete Phase 3: User Story 1 (core scroll-to-top)
4. **STOP and VALIDATE**: Test scroll-to-top works independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Hook ready
2. Add User Story 1 → Core scroll-to-top works → Test independently
3. Add User Story 2 → Responsive visibility → Test independently
4. Add User Story 3 → Fixed positioning + accessibility → Test independently
5. Run quality gates (lint, type check, tests, build)
6. Each phase adds value without breaking previous phases

### Single Developer Strategy

Since this is a single component feature:

1. Complete Foundational (hook) first
2. Implement User Story 1 (core functionality)
3. Implement User Story 2 (responsive visibility)
4. Implement User Story 3 (positioning + accessibility)
5. Run all quality gates together

---

## Task Summary

| Phase                 | Task Count | Description                           |
| --------------------- | ---------- | ------------------------------------- |
| Phase 1: Setup        | 2          | Verify project structure              |
| Phase 2: Foundational | 2          | Create scroll position hook           |
| Phase 3: User Story 1 | 5          | Core scroll-to-top functionality      |
| Phase 4: User Story 2 | 2          | Responsive visibility (XL breakpoint) |
| Phase 5: User Story 3 | 10         | Fixed positioning + WCAG 2.1 AA       |
| Phase 6: Polish       | 6          | Quality gates and validation          |
| **Total**             | **27**     | Complete feature implementation       |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- 100% test coverage is MANDATORY (constitution requirement)
