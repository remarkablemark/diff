# Tasks: Text Diff Checker

**Input**: Design documents from `/specs/001-text-diff/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Included — plan.md and constitution mandate 100% test coverage (`npm run test:ci`).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install the new runtime dependency and create the shared type definitions that all components depend on.

- [ ] T001 Install `diff` npm package as a runtime dependency via `npm install diff`
- [ ] T002 Create shared type definitions (`DiffType`, `DiffSegment`, `DiffResult`, `ViewMode`) in src/types/diff.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core hooks that MUST be complete before ANY user story can be implemented. All components depend on these.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T003 [P] Implement `useDiff` hook wrapping `diffWords()` from `diff` library in src/hooks/useDiff.ts
- [ ] T004 [P] Write unit tests for `useDiff` hook in src/hooks/useDiff.test.ts (empty inputs → null, identical texts → hasChanges false, different texts → correct segments)
- [ ] T005 [P] Implement `useMediaQuery` hook using `window.matchMedia` in src/hooks/useMediaQuery.ts
- [ ] T006 [P] Write unit tests for `useMediaQuery` hook in src/hooks/useMediaQuery.test.ts (matches/no-match, resize updates, SSR fallback)

**Checkpoint**: Foundation ready — hooks tested, types defined, `diff` library installed. User story implementation can now begin.

---

## Phase 3: User Story 1 — Compare Two Text Inputs (Priority: P1) 🎯 MVP

**Goal**: User sees two text areas, enters text in both, and the system computes and displays the differences between them. This is the core value proposition.

**Independent Test**: Enter different text in each input area and verify that the diff output correctly identifies additions, deletions, and unchanged portions.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T007 [P] [US1] Write unit tests for `TextInput` component in src/components/TextInput/TextInput.test.tsx (renders textarea with label, line number gutter, scroll sync, onChange callback, placeholder)
- [ ] T008 [P] [US1] Write unit tests for `App` component (US1 scope) in src/components/App/App.test.tsx (renders two text inputs with labels "Original Text" and "Modified Text", hides diff output when inputs are empty, hides diff output when only one input has text, shows "No differences found" when texts are identical, shows diff segments when texts differ)

### Implementation for User Story 1

- [ ] T009 [P] [US1] Create `TextInputProps` interface in src/components/TextInput/TextInput.types.ts
- [ ] T010 [P] [US1] Create barrel export in src/components/TextInput/index.ts
- [ ] T011 [US1] Implement `TextInput` component with `<textarea>`, line number gutter (`aria-hidden="true"`), scroll sync, and `<label>` in src/components/TextInput/TextInput.tsx
- [ ] T012 [US1] Update `App` component to render two `TextInput` components (original + modified) with `useState` for each, responsive side-by-side layout (`flex flex-col md:flex-row`), fixed-height textareas with internal scroll, and basic diff output area showing `useDiff` result in src/components/App/App.tsx
- [ ] T013 [US1] Remove placeholder content (brands, counter) from src/components/App/App.tsx and src/components/App/brands.ts

**Checkpoint**: User Story 1 is fully functional — two text inputs compute and display a basic diff. Testable independently with `npm run test:ci`.

---

## Phase 4: User Story 2 — Visual Diff Output with Color Coding (Priority: P2)

**Goal**: Diff result is displayed with clear visual indicators — removed text in red, added text in green, unchanged text normal. User can toggle between unified inline and side-by-side views. On mobile (<768px), unified view is forced and toggle is hidden.

**Independent Test**: Compare two texts with known differences and verify additions appear in green, deletions in red, unchanged text has no highlighting. Toggle between views and verify both render correctly.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T014 [P] [US2] Write unit tests for `DiffViewer` component in src/components/DiffViewer/DiffViewer.test.tsx (renders null result as empty, renders "No differences found" with `role="status"` when hasChanges is false, renders added segments with green styling and `+` prefix, renders removed segments with red styling and `-` prefix, renders unchanged segments without highlighting, renders unified view correctly, renders side-by-side view correctly, wraps output in `aria-live="polite"`)
- [ ] T015 [P] [US2] Write unit tests for `ViewToggle` component in src/components/ViewToggle/ViewToggle.test.tsx (renders two buttons for unified and side-by-side, highlights active mode, calls onModeChange on click, is keyboard accessible)

### Implementation for User Story 2

- [ ] T016 [P] [US2] Create `DiffViewerProps` interface in src/components/DiffViewer/DiffViewer.types.ts
- [ ] T017 [P] [US2] Create barrel export in src/components/DiffViewer/index.ts
- [ ] T018 [P] [US2] Create `ViewToggleProps` interface in src/components/ViewToggle/ViewToggle.types.ts
- [ ] T019 [P] [US2] Create barrel export in src/components/ViewToggle/index.ts
- [ ] T020 [US2] Implement `DiffViewer` component with unified view (single column, interleaved changes with `+`/`-` markers, red/green Tailwind classes, dark mode variants) and side-by-side view (two-column grid, left=removed+unchanged, right=added+unchanged), `aria-live="polite"`, "No differences found" with `role="status"` in src/components/DiffViewer/DiffViewer.tsx
- [ ] T021 [US2] Implement `ViewToggle` component with button group for unified/side-by-side, active state styling, `hidden md:flex` responsive visibility in src/components/ViewToggle/ViewToggle.tsx
- [ ] T022 [US2] Update `App` component to integrate `DiffViewer`, `ViewToggle`, and `useMediaQuery` — add `viewMode` state, compute `effectiveViewMode` (forced unified on mobile), pass props to `DiffViewer` and `ViewToggle` in src/components/App/App.tsx
- [ ] T023 [US2] Update `App` tests to cover view toggle integration, effective view mode on mobile, color-coded diff rendering, and dark mode classes in src/components/App/App.test.tsx

**Checkpoint**: User Stories 1 AND 2 are both functional — full color-coded diff with unified/side-by-side toggle. Testable independently.

---

## Phase 5: User Story 3 — Real-Time Diff Updates (Priority: P3)

**Goal**: Diff output updates automatically on every keystroke without any manual trigger (no button, no debounce). Provides an immediate, interactive experience.

**Independent Test**: Type in one of the text areas and verify that the diff output updates as the user types, without any additional user action.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T024 [US3] Write integration tests for real-time updates in src/components/App/App.test.tsx (diff updates on each keystroke in either textarea, diff updates when text is pasted, diff output transitions from hidden → visible as user types in second textarea, diff output transitions from visible → "No differences found" when user makes texts identical)

### Implementation for User Story 3

- [ ] T025 [US3] Verify and ensure `App` component wires `TextInput` onChange directly to `useState` setters with no debounce or intermediate state in src/components/App/App.tsx (this should already work from US1 — validate and fix if needed)
- [ ] T026 [US3] Verify edge case handling: clearing one input after diff is displayed updates output, pasting large text triggers immediate recomputation, special characters/unicode/emoji handled correctly in src/components/App/App.test.tsx

**Checkpoint**: All three user stories are independently functional — real-time diff with color coding and view toggle.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass affecting multiple user stories.

- [ ] T027 [P] Apply dark mode styling (`dark:` variants) to all components — root element (`bg-white dark:bg-gray-900`), textareas, line gutters, diff highlights, toggle buttons per research.md color specs in src/components/
- [ ] T028 [P] Apply responsive layout polish — verify stacked layout on mobile, side-by-side on `md:`, fixed-height textareas with internal scroll on all breakpoints in src/components/App/App.tsx
- [ ] T029 [P] Accessibility audit — verify all `<label>` associations, `aria-live="polite"` on diff output, `role="status"` on no-diff message, `aria-hidden="true"` on line gutters, `+`/`-` text markers on diff segments, keyboard tab order
- [ ] T030 Run all quality gates: `npm run lint`, `npm run lint:tsc`, `npm run test:ci`, `npm run build`
- [ ] T031 Run quickstart.md validation — follow all steps in specs/001-text-diff/quickstart.md and verify they work end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (types + `diff` package) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 — can start after foundational hooks are tested
- **User Story 2 (Phase 4)**: Depends on Phase 2 and Phase 3 (needs `TextInput` and basic `App` composition from US1)
- **User Story 3 (Phase 5)**: Depends on Phase 3 (validates real-time behavior of US1 wiring); can run in parallel with Phase 4
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 (`App` composition, `TextInput` exists) — extends the `App` with `DiffViewer` and `ViewToggle`
- **User Story 3 (P3)**: Depends on US1 (validates the real-time wiring) — can run in parallel with US2

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Type definitions and barrel exports before component implementation
- Component implementation before `App` integration
- `App` integration tests updated after wiring

### Parallel Opportunities

- **Phase 2**: T003+T004 (useDiff) and T005+T006 (useMediaQuery) can run in parallel — different files
- **Phase 3**: T007 and T008 (tests) can run in parallel; T009 and T010 (types/barrel) can run in parallel
- **Phase 4**: T014 and T015 (tests) can run in parallel; T016–T019 (types/barrels) can run in parallel
- **Phase 5 and Phase 4**: US3 tests (T024) can start in parallel with US2 implementation if US1 is complete
- **Phase 6**: T027, T028, T029 can run in parallel — different concerns

---

## Parallel Example: User Story 2

```text
# Launch all tests for User Story 2 together:
Task T014: "Write unit tests for DiffViewer in src/components/DiffViewer/DiffViewer.test.tsx"
Task T015: "Write unit tests for ViewToggle in src/components/ViewToggle/ViewToggle.test.tsx"

# Launch all type definitions together:
Task T016: "Create DiffViewerProps interface in src/components/DiffViewer/DiffViewer.types.ts"
Task T017: "Create barrel export in src/components/DiffViewer/index.ts"
Task T018: "Create ViewToggleProps interface in src/components/ViewToggle/ViewToggle.types.ts"
Task T019: "Create barrel export in src/components/ViewToggle/index.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install `diff`, create types)
2. Complete Phase 2: Foundational (hooks + tests)
3. Complete Phase 3: User Story 1 (TextInput + basic App)
4. **STOP and VALIDATE**: Test User Story 1 independently with `npm run test:ci`
5. Deploy/demo if ready — users can already compare two texts

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (color-coded diff with view toggle)
4. Add User Story 3 → Test independently → Deploy/Demo (real-time updates validated)
5. Polish → Final quality pass → Production ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group using conventional commits
- Stop at any checkpoint to validate story independently
- The `diff` library ships with TypeScript types since v8 — no `@types/diff` needed
