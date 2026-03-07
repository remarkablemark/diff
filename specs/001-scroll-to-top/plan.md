# Implementation Plan: Scroll to Top Button

**Branch**: `001-scroll-to-top` | **Date**: 2026-03-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-scroll-to-top/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement a scroll-to-top button that appears when users scroll down past 50vh on screens ≥1280px (XL breakpoint). The button is fixed at bottom-right (16px offset), circular (40-48px), displays an upward arrow icon (Unicode/HTML entity), and provides smooth scroll-to-top functionality with full WCAG 2.1 AA accessibility support.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode)
**Primary Dependencies**: React 19, Tailwind CSS 4
**Storage**: N/A (no persistence)
**Testing**: Vitest 4 with @testing-library/react and @testing-library/user-event
**Target Platform**: Modern browsers (desktop ≥1280px width)
**Project Type**: Desktop web application (client-side only SPA)
**Performance Goals**: Button appears within 100ms, scroll animation completes within 500ms
**Constraints**: Client-side only, 100% test coverage required, WCAG 2.1 AA accessible
**Scale/Scope**: Single component feature, ~100-200 lines of code

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                     | Status  | Notes                                                   |
| ----------------------------- | ------- | ------------------------------------------------------- |
| I. Client-Side Only           | ✅ PASS | All logic executes in browser, no backend               |
| II. Full Test Coverage        | ✅ PASS | Component + hook tests with 100% coverage required      |
| III. Accessibility First      | ✅ PASS | WCAG 2.1 AA explicitly required (keyboard, ARIA, focus) |
| IV. Type Safety               | ✅ PASS | TypeScript strict mode, explicit interfaces             |
| V. Simplicity and Performance | ✅ PASS | Single component, no state libraries, Tailwind only     |

**Verdict**: All gates pass. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-scroll-to-top/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A - no data model)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no external interfaces)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── ScrollToTop/
│       ├── ScrollToTop.tsx
│       ├── ScrollToTop.types.ts
│       ├── ScrollToTop.test.tsx
│       └── index.ts
├── hooks/
│   ├── useScrollPosition.ts
│   └── useScrollPosition.test.ts
└── ...existing structure

tests/
└── ...existing structure (tests co-located with source)
```

**Structure Decision**: Following established project pattern for components (matching ViewToggle, TextInput, DiffMethodToggle structure) and hooks (matching useMediaQuery, useLocalStorage pattern).

## Complexity Tracking

No constitution violations. Complexity tracking N/A.

## Phase 0: Research & Discovery

### Research Topics

1. **Scroll event handling best practices in React**
   - Passive event listeners for performance
   - Debouncing/throttling strategies
   - requestAnimationFrame usage

2. **Smooth scroll behavior**
   - Native `scrollTo({ behavior: 'smooth' })` support
   - Fallback strategies for reduced motion preferences
   - Cross-browser compatibility

3. **WCAG 2.1 AA button requirements**
   - Keyboard interaction patterns (Enter/Space)
   - Focus indicator requirements
   - ARIA labeling best practices

4. **Tailwind CSS 4 fixed positioning**
   - Utility classes for fixed positioning
   - Responsive breakpoint utilities (xl = 1280px)
   - Dark mode support patterns

### Research Dispatch

```text
Task 1: Research scroll event handling patterns in React 19
Task 2: Research smooth scroll API and reduced motion media query
Task 3: Research WCAG 2.1 AA button compliance requirements
Task 4: Research Tailwind CSS 4 positioning utilities
```

## Phase 1: Design & Contracts

### Data Model

N/A - This feature has no data entities. It's a UI component with behavioral logic.

### Interface Contracts

N/A - This feature exposes no external interfaces. It's an internal UI component.

### Component API Design

**ScrollToTop Component**

```typescript
interface ScrollToTopProps {
  // No props - component is self-contained
}
```

**useScrollPosition Hook**

```typescript
interface UseScrollPositionOptions {
  threshold: number | '50vh'; // Scroll threshold for visibility
}

function useScrollPosition(options?: UseScrollPositionOptions): {
  isScrolledPastThreshold: boolean;
  scrollY: number;
};
```

### Quickstart

```bash
# 1. Create component files
mkdir -p src/components/ScrollToTop

# 2. Create hook files
touch src/hooks/useScrollPosition.ts

# 3. Run development server
npm start

# 4. Run tests
npm test

# 5. Verify coverage
npm run test:ci
```

## Phase 2: Implementation Tasks

### Task Breakdown

1. **Create useScrollPosition hook**
   - Track scroll Y position
   - Calculate 50vh threshold dynamically
   - Return isScrolledPastThreshold boolean

2. **Create ScrollToTop component**
   - Fixed positioning (bottom-right, 16px offset)
   - Circular shape (40-48px)
   - Upward arrow icon (Unicode ▲ or similar)
   - Hover states (cursor pointer, background change)
   - Focus ring for accessibility
   - ARIA label "Scroll to top"
   - Keyboard handler (Enter/Space)

3. **Integrate into App component**
   - Import ScrollToTop
   - Render in App layout

4. **Write tests**
   - Hook tests (scroll threshold logic)
   - Component tests (rendering, interactions, accessibility)

5. **Verify quality gates**
   - Lint: `npm run lint`
   - Type check: `npm run lint:tsc`
   - Tests: `npm run test:ci` (100% coverage)
   - Build: `npm run build`

## Phase 3: Validation

### Acceptance Criteria

- [ ] Button appears when scrolled past 50vh
- [ ] Button hidden when at top of page
- [ ] Button only visible on screens ≥1280px (XL)
- [ ] Button fixed at bottom-right with 16px offset
- [ ] Button is circular (40-48px diameter)
- [ ] Upward arrow icon displayed
- [ ] Cursor pointer on hover
- [ ] Background color change on hover
- [ ] Keyboard accessible (Tab, Enter/Space)
- [ ] Visible focus ring
- [ ] ARIA label "Scroll to top"
- [ ] Respects reduced motion preferences
- [ ] 100% test coverage maintained
- [ ] All quality gates pass

### Risk Assessment

| Risk                               | Likelihood | Impact | Mitigation                                           |
| ---------------------------------- | ---------- | ------ | ---------------------------------------------------- |
| Scroll event performance           | Low        | Medium | Use passive listener, throttle/debounce              |
| Cross-browser smooth scroll        | Low        | Low    | Native API has wide support, reduced motion fallback |
| Focus ring visibility in dark mode | Low        | Low    | Test in both light/dark modes                        |

## Constitution Check (Post-Design)

_Re-evaluate after design complete._

| Principle                     | Status  | Notes                         |
| ----------------------------- | ------- | ----------------------------- |
| I. Client-Side Only           | ✅ PASS | Confirmed                     |
| II. Full Test Coverage        | ✅ PASS | Tests planned for all code    |
| III. Accessibility First      | ✅ PASS | WCAG 2.1 AA built into design |
| IV. Type Safety               | ✅ PASS | Interfaces defined            |
| V. Simplicity and Performance | ✅ PASS | Minimal implementation        |

**Verdict**: All gates pass. Proceeding to implementation.
