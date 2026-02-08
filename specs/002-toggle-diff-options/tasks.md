# Tasks: Toggle Diff Options

**Input**: Design documents from `/specs/002-toggle-diff-options/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Included — plan.md and constitution mandate 100% test coverage (`npm run test:ci`).

**Organization**: Tasks are grouped by phase. This feature has a single user story (US1), so Phases 1–2 set up shared infrastructure and Phase 3 implements the story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the `DiffMethod` type and the generic `useLocalStorage` hook that all subsequent tasks depend on.

- [x] T001 Add `DiffMethod` type (`'characters' | 'words' | 'lines'`) to src/types/diff.ts
- [x] T002 [P] Write unit tests for `useLocalStorage` hook in src/hooks/useLocalStorage.test.ts (read/write, fallback on missing key, fallback on invalid JSON, update persists to localStorage)
- [x] T003 [P] Implement `useLocalStorage<T>` hook in src/hooks/useLocalStorage.ts (generic useState + localStorage read/write with JSON serialization and error fallback)

**Checkpoint**: `DiffMethod` type exists, `useLocalStorage` hook is tested and working.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update the `useDiff` hook to accept a `DiffMethod` parameter. This MUST be complete before the UI can wire up the toggle.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Update `useDiff` hook to accept a third parameter `method: DiffMethod` and dispatch to `diffChars`/`diffWords`/`diffLines` in src/hooks/useDiff.ts
- [x] T005 Update `useDiff` tests to cover character-level and line-level diff methods in src/hooks/useDiff.test.ts

**Checkpoint**: `useDiff` supports all three diff methods with tests passing.

---

## Phase 3: User Story 1 — Toggle Diff Method (Priority: P1) 🎯 MVP

**Goal**: User can switch between character, word, and line diff methods via a segmented button group. Selections persist to localStorage. View mode also persists to localStorage.

**Independent Test**: Enter two texts with known differences, toggle between Characters/Words/Lines, and verify the diff output changes granularity. Reload the page and verify the selection is restored.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T006 [P] [US1] Write unit tests for `DiffMethodToggle` component in src/components/DiffMethodToggle/DiffMethodToggle.test.tsx (renders three buttons for characters/words/lines, highlights active method, calls onMethodChange on click, is keyboard accessible)
- [x] T007 [P] [US1] Write integration tests for diff method switching in src/components/App/App.test.tsx (switching method changes diff output, default is "words", localStorage persistence restores selection on re-render)

### Implementation for User Story 1

- [x] T008 [P] [US1] Create `DiffMethodToggleProps` interface in src/components/DiffMethodToggle/DiffMethodToggle.types.ts
- [x] T009 [P] [US1] Create barrel export in src/components/DiffMethodToggle/index.ts
- [x] T010 [US1] Implement `DiffMethodToggle` component with 3-button segmented group (Characters | Words | Lines), `role="group"`, `aria-label`, active/inactive Tailwind styling per research.md in src/components/DiffMethodToggle/DiffMethodToggle.tsx
- [x] T011 [US1] Update `App` component: add `diffMethod` state via `useLocalStorage('diffMethod', 'words')`, migrate `viewMode` to `useLocalStorage('viewMode', 'unified')`, pass `diffMethod` to `useDiff` and `DiffMethodToggle`, place `DiffMethodToggle` on left side of diff header in src/components/App/App.tsx

**Checkpoint**: User Story 1 is fully functional — diff method toggle works, selections persist to localStorage, all tests pass.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass.

- [x] T012 [P] Accessibility audit — verify `role="group"`, `aria-label` on DiffMethodToggle, keyboard tab order, button focus states
- [x] T013 Run all quality gates: `npm run lint`, `npm run lint:tsc`, `npm run test:ci`, `npm run build`
- [x] T014 Run quickstart.md validation — follow all steps in specs/002-toggle-diff-options/quickstart.md and verify they work end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (`DiffMethod` type) — BLOCKS user story
- **User Story 1 (Phase 3)**: Depends on Phase 2 (`useDiff` with method param) and Phase 1 (`useLocalStorage`)
- **Polish (Phase 4)**: Depends on Phase 3 being complete

### Within User Story 1

- Tests MUST be written and FAIL before implementation
- Type definitions and barrel exports before component implementation
- Component implementation before App integration
- App integration tests updated after wiring

### Parallel Opportunities

- **Phase 1**: T002 (useLocalStorage tests) and T003 (useLocalStorage impl) can run in parallel with each other after T001
- **Phase 3**: T006 (DiffMethodToggle tests) and T007 (App tests) can run in parallel; T008 and T009 (types/barrel) can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (DiffMethod type + useLocalStorage)
2. Complete Phase 2: Foundational (useDiff with method param)
3. Complete Phase 3: User Story 1 (DiffMethodToggle + App wiring + localStorage)
4. **STOP and VALIDATE**: Test diff method switching independently
5. Complete Phase 4: Polish & quality gates

---

## Notes

- [P] tasks = different files, no dependencies
- [US1] label maps task to User Story 1 for traceability
- No new runtime dependencies — `diffChars`/`diffLines` already in `diff` package, `localStorage` is browser-native
- Existing `ViewToggle` component is NOT modified — `DiffMethodToggle` is a new sibling component
- `useLocalStorage` replaces `useState` for both `diffMethod` and `viewMode` in App
