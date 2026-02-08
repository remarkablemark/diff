# Quickstart: Text Diff Checker

**Feature Branch**: `001-text-diff`
**Date**: 2026-02-07

## Prerequisites

- Node.js 24 (see `.nvmrc`)
- npm (bundled with Node.js)

## Setup

```bash
# Clone and switch to feature branch
git checkout 001-text-diff

# Install dependencies
npm install

# Install the diff library (new runtime dependency)
npm install diff
```

## Development

```bash
# Start dev server (opens http://localhost:5173)
npm start
```

## Quality Gates

Run all gates before committing:

```bash
# 1. Lint (zero errors, zero warnings)
npm run lint

# 2. Type check (zero errors)
npm run lint:tsc

# 3. Tests with 100% coverage
npm run test:ci

# 4. Production build
npm run build
```

## Key Files to Implement

| File                                            | Purpose                                               |
| ----------------------------------------------- | ----------------------------------------------------- |
| `src/types/diff.ts`                             | Shared types: `DiffSegment`, `DiffResult`, `ViewMode` |
| `src/hooks/useDiff.ts`                          | Hook wrapping `diffWords()` from `diff` library       |
| `src/hooks/useDiff.test.ts`                     | Hook unit tests                                       |
| `src/components/TextInput/TextInput.tsx`        | Textarea with line number gutter                      |
| `src/components/TextInput/TextInput.test.tsx`   | TextInput tests                                       |
| `src/components/DiffViewer/DiffViewer.tsx`      | Diff output (unified + side-by-side)                  |
| `src/components/DiffViewer/DiffViewer.test.tsx` | DiffViewer tests                                      |
| `src/components/ViewToggle/ViewToggle.tsx`      | Toggle between unified/side-by-side                   |
| `src/components/ViewToggle/ViewToggle.test.tsx` | ViewToggle tests                                      |
| `src/components/App/App.tsx`                    | Root component composing all pieces                   |
| `src/components/App/App.test.tsx`               | Integration-level tests                               |

## Implementation Order

1. **Types** (`src/types/diff.ts`) — no dependencies
2. **useDiff hook** — depends on types + `diff` library
3. **TextInput** — standalone component
4. **ViewToggle** — standalone component
5. **DiffViewer** — depends on types
6. **App** — composes all components

## Testing

```bash
# Run all tests in watch mode
npm test

# Run a specific test file
npm test -- --run src/hooks/useDiff.test.ts

# Run tests with coverage report
npm run test:ci
```

## Commit Convention

This project uses Conventional Commits (enforced by commitlint):

```bash
# Examples
git commit -m "feat: add TextInput component with line number gutter"
git commit -m "feat: add useDiff hook for word-level diff computation"
git commit -m "test: add DiffViewer component tests"
```
