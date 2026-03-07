# Quickstart: Scroll to Top Button

**Feature**: Scroll to Top Button
**Branch**: 001-scroll-to-top

## Overview

This feature adds a scroll-to-top button that appears when users scroll down past 50vh on screens ≥1280px (XL breakpoint).

## File Structure

```
src/
├── components/
│   └── ScrollToTop/
│       ├── ScrollToTop.tsx       # Main component
│       ├── ScrollToTop.types.ts  # TypeScript types
│       ├── ScrollToTop.test.tsx  # Component tests
│       └── index.ts              # Public exports
└── hooks/
    ├── useScrollPosition.ts      # Scroll position hook
    └── useScrollPosition.test.ts # Hook tests
```

## Implementation Steps

### 1. Create the Hook

Create `src/hooks/useScrollPosition.ts`:

- Use `useSyncExternalStore` pattern (like `useMediaQuery`)
- Track scroll Y position with passive event listener
- Calculate 50vh threshold dynamically
- Return `isScrolledPastThreshold` boolean

### 2. Create the Component

Create `src/components/ScrollToTop/ScrollToTop.tsx`:

- Fixed positioning: `fixed bottom-4 right-4`
- Responsive visibility: `hidden xl:block`
- Circular shape: `rounded-full h-12 w-12`
- Upward arrow icon: Unicode `▲` or HTML entity `&Delta;`
- Hover states: `cursor-pointer` + background color change
- Focus ring: `focus:ring-2 focus:ring-blue-500`
- ARIA label: `aria-label="Scroll to top"`
- Keyboard handler: Enter/Space triggers scroll

### 3. Create Types

Create `src/components/ScrollToTop/ScrollToTop.types.ts`:

- Define `ScrollToTopProps` interface (empty for this component)

### 4. Create Index

Create `src/components/ScrollToTop/index.ts`:

- Export component as default
- Export types if needed

### 5. Write Tests

Create `src/components/ScrollToTop/ScrollToTop.test.tsx`:

- Test rendering (hidden at top, visible when scrolled)
- Test responsive visibility (hidden below XL)
- Test click behavior (scrolls to top)
- Test keyboard accessibility (Enter/Space)
- Test ARIA attributes

Create `src/hooks/useScrollPosition.test.ts`:

- Test threshold calculation
- Test scroll position tracking

### 6. Integrate into App

Update `src/components/App/App.tsx`:

- Import `ScrollToTop` component
- Render `<ScrollToTop />` in the component tree

### 7. Verify Quality Gates

```bash
# Lint
npm run lint

# Type check
npm run lint:tsc

# Tests with coverage
npm run test:ci

# Production build
npm run build
```

All must pass with 100% test coverage.

## Key Technical Details

- **Scroll threshold**: 50vh (half viewport height, dynamic)
- **Breakpoint**: XL (1280px) - Tailwind default
- **Button size**: 48px diameter (h-12 w-12)
- **Offset**: 16px from bottom and right (bottom-4 right-4)
- **Icon**: Unicode upward arrow (▲)
- **Animation**: Native `scrollTo({ behavior: 'smooth' })`
- **Accessibility**: WCAG 2.1 AA compliant

## Testing Checklist

- [ ] Button hidden at page top
- [ ] Button visible after scrolling past 50vh
- [ ] Button hidden on screens < 1280px
- [ ] Button visible on screens ≥ 1280px
- [ ] Click scrolls to top smoothly
- [ ] Keyboard Enter/Space scrolls to top
- [ ] Focus ring visible on tab navigation
- [ ] ARIA label present
- [ ] Respects reduced motion preferences
- [ ] 100% test coverage maintained
