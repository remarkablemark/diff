# diff Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-07

## Tech Stack

### Core

- **TypeScript** 5 (strict mode)
- **React** 19
- **Vite** 7 (build tool)
- **Tailwind CSS** 4

### Runtime Dependencies

- **diff** 8 (text diffing: `diffChars`, `diffWords`, `diffLines`)

### Testing

- **Vitest** 4
- **@testing-library/react** 16
- **@testing-library/user-event** 14
- **@vitest/coverage-v8** 4

### Code Quality

- **ESLint** 9 with TypeScript support
- **Prettier** 3 with Tailwind plugin
- **React Compiler** (babel-plugin-react-compiler 1)

## Project Structure

```text
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
public/             # Static assets
specs/              # Feature specifications
```

## State Management

- **Browser URL query string** (primary state persistence)
- **localStorage** (fallback for user defaults)
- Client-side only (no backend)

## Commands

### Development

- `npm start` - Start dev server
- `npm run build` - Production build

### Testing & Quality

- `npm test` - Run tests
- `npm run test:ci` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix ESLint errors
- `npm run lint:tsc` - TypeScript type checking

## Code Style

- TypeScript strict mode enabled
- Follow ESLint + Prettier configuration
- Import order enforced by eslint-plugin-simple-import-sort
- Functional components only with React hooks

## Feature History

- **001-querystring-state**: URL-based state persistence with lz-string compression
- **001-fix-line-number-scrolling**: Line number scrolling fixes
- **003-diff-line-numbers**: Diff line number implementation
- **002-toggle-diff-options**: Diff method toggle (chars/words/lines)
- **001-text-diff**: Core text diffing functionality

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
