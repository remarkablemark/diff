# Quickstart: Toggle Diff Options

**Feature Branch**: `002-toggle-diff-options`
**Date**: 2026-02-08

## Prerequisites

- Node.js 24 (see `.nvmrc`)
- npm (bundled with Node.js)

## Setup

```bash
# Switch to feature branch
git checkout 002-toggle-diff-options

# Install dependencies (no new packages needed)
npm install

# Start dev server
npm start
```

## Development Commands

```bash
# Lint
npm run lint

# Lint with auto-fix
npm run lint:fix

# Type check
npm run lint:tsc

# Run a specific test file
npm test -- src/hooks/useLocalStorage.test.ts

# Run tests with coverage report
npm run test:ci

# Build for production
npm run build
```

## Quality Gates

All must pass before merge:

```bash
npm run lint        # Zero errors, zero warnings
npm run lint:tsc    # Zero type errors
npm run test:ci     # All tests pass, 100% coverage
npm run build       # Clean production build
```

## Key Files to Implement

### New Files

| File                                                        | Purpose                                          |
| ----------------------------------------------------------- | ------------------------------------------------ |
| `src/hooks/useLocalStorage.ts`                              | Generic localStorage persistence hook            |
| `src/hooks/useLocalStorage.test.ts`                         | Tests for useLocalStorage                        |
| `src/components/DiffMethodToggle/DiffMethodToggle.tsx`      | Segmented button group for diff method selection |
| `src/components/DiffMethodToggle/DiffMethodToggle.types.ts` | Props interface                                  |
| `src/components/DiffMethodToggle/DiffMethodToggle.test.tsx` | Component tests                                  |
| `src/components/DiffMethodToggle/index.ts`                  | Barrel export                                    |

### Modified Files

| File                              | Change                                                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `src/types/diff.ts`               | Add `DiffMethod` type                                                                                                           |
| `src/hooks/useDiff.ts`            | Accept `DiffMethod` param, dispatch to correct diff function                                                                    |
| `src/hooks/useDiff.test.ts`       | Add tests for character and line diff methods                                                                                   |
| `src/components/App/App.tsx`      | Add `diffMethod` state via `useLocalStorage`, wire to `DiffMethodToggle` and `useDiff`; migrate `viewMode` to `useLocalStorage` |
| `src/components/App/App.test.tsx` | Add tests for diff method switching and localStorage persistence                                                                |

## Implementation Order

1. Add `DiffMethod` type to `src/types/diff.ts`
2. Implement `useLocalStorage` hook + tests
3. Update `useDiff` hook to accept `DiffMethod` + tests
4. Implement `DiffMethodToggle` component + tests
5. Update `App` to wire everything together + tests
6. Run all quality gates
