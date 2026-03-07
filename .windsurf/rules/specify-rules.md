# diff Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-07

## Active Technologies

- TypeScript 5 (strict mode) + React 19, lz-string (compression library) (001-querystring-state)
- Browser URL query string (primary), localStorage (fallback for defaults) (001-querystring-state)

- TypeScript 5 (strict mode) + React 19, Vite 7, Vitest 4, @testing-library/react, @testing-library/user-even (001-fix-line-number-scrolling)

- TypeScript 5, React 19 + `diff` npm package (diffChars, diffWords, diffLines), React hooks (003-diff-line-numbers)
- N/A (client-side only) (003-diff-line-numbers)

- TypeScript 5 (strict mode) + React 19, `diff` npm package (already installed — exports `diffChars`, `diffWords`, `diffLines`) (002-toggle-diff-options)
- localStorage (browser-native, no new dependencies) (002-toggle-diff-options)

- N/A (client-side only, no persistence) (001-text-diff)

- TypeScript 5.9.3 (strict mode) + React 19.2.4, `diff` (npm — to be added as runtime dependency) (001-text-diff)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.9.3 (strict mode): Follow standard conventions

## Recent Changes

- 001-querystring-state: Added TypeScript 5 (strict mode) + React 19, lz-string (compression library)

- 001-fix-line-number-scrolling: Added TypeScript 5 (strict mode) + React 19, Vite 7, Vitest 4, @testing-library/react, @testing-library/user-even

- 003-diff-line-numbers: Added TypeScript 5, React 19 + `diff` npm package (diffChars, diffWords, diffLines), React hooks

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
