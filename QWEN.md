# diff Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-03

## Active Technologies

- TypeScript 5 (strict mode) + React 19, diff library (v8) (001-fix-diff-gutter)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5 (strict mode): Follow standard conventions

## Recent Changes

- 001-fix-diff-gutter: Restructured DiffViewer to use CSS grid rows with inline line numbers, ensuring line numbers always match content height when text wraps. Removed separate LineNumberGutter component from unified view and unused scroll sync logic.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
