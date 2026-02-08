# Quickstart: Diff Line Numbers

**Feature**: 003-diff-line-numbers
**Date**: 2026-02-08

## Setup

```bash
git checkout 003-diff-line-numbers
npm install
```

## Development Commands

| Command                    | Purpose                             |
| -------------------------- | ----------------------------------- |
| `npm start`                | Dev server at http://localhost:5173 |
| `npm run lint`             | Run ESLint                          |
| `npm run lint:fix`         | Auto-fix ESLint errors              |
| `npm run lint:tsc`         | TypeScript type checking            |
| `npm test -- path/to/test` | Run a single test file              |
| `npm run test:ci`          | Run all tests with 100% coverage    |
| `npm run build`            | Production build                    |

## Quality Gates (must all pass)

```bash
npm run lint
npm run lint:tsc
npm run test:ci
npm run build
```

## Key Files

### New Files

| File                                | Purpose                                   |
| ----------------------------------- | ----------------------------------------- |
| `src/utils/segmentsToLines.ts`      | Pure function: DiffSegment[] → DiffLine[] |
| `src/utils/segmentsToLines.test.ts` | Unit tests for segmentsToLines            |

### Modified Files

| File                                            | Change                                           |
| ----------------------------------------------- | ------------------------------------------------ |
| `src/types/diff.ts`                             | Add `DiffLine` and `DiffLineResult` interfaces   |
| `src/hooks/useDiff.ts`                          | Return `DiffLineResult` (includes `lines` array) |
| `src/hooks/useDiff.test.ts`                     | Add tests for line number output                 |
| `src/components/DiffViewer/DiffViewer.tsx`      | Row-based rendering with line number gutters     |
| `src/components/DiffViewer/DiffViewer.types.ts` | Update props to accept `DiffLineResult`          |
| `src/components/DiffViewer/DiffViewer.test.tsx` | Add line number rendering tests                  |
| `src/components/App/App.tsx`                    | Pass updated result to DiffViewer                |
| `src/components/App/App.test.tsx`               | Integration tests for line numbers               |

## Implementation Order

1. **Add types** — `DiffLine` and `DiffLineResult` in `src/types/diff.ts`
2. **Implement `segmentsToLines`** — pure utility + tests in `src/utils/`
3. **Update `useDiff`** — return `DiffLineResult` with `lines` field + tests
4. **Update `DiffViewer`** — row-based rendering with gutters + tests
5. **Update `App`** — wire updated result type + integration tests
6. **Run all quality gates**

## Independent Test

1. Paste two multi-line texts with known differences
2. View unified diff — verify two-column gutter (original | modified line numbers)
3. Switch to side-by-side view — verify each column has its own gutter
4. Toggle between Characters/Words/Lines diff methods — verify line numbers remain correct
5. Try single-line input — verify gutter shows line 1
6. Try asymmetric inputs (one much longer) — verify counters increment independently
