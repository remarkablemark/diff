# diff Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-06

## Active Technologies

- TypeScript 5 (strict mode) + React 19, Tailwind CSS 4

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

- 001-scroll-to-top: Scroll-to-top button fixed to bottom-right above XL breakpoint (circular, 48px, Unicode arrow, WCAG 2.1 AA)
- 001-fix-diff-gutter: Restructured DiffViewer to use CSS grid rows with inline line numbers, ensuring line numbers always match content height when text wraps. Removed separate LineNumberGutter component from unified view and unused scroll sync logic.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
