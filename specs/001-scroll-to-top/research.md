# Research: Scroll to Top Button

**Date**: 2026-03-06
**Feature**: Scroll to Top Button
**Branch**: 001-scroll-to-top

## Research Topics Resolved

### 1. Scroll Event Handling in React 19

**Decision**: Use passive event listener with `useSyncExternalStore` pattern

**Rationale**:

- The project already uses `useSyncExternalStore` for `useMediaQuery` hook
- Passive listeners improve scroll performance by signaling browser that `preventDefault()` won't be called
- Pattern matches existing codebase conventions

**Implementation Pattern**:

```typescript
const subscribe = useCallback((callback: () => void) => {
  window.addEventListener('scroll', callback, { passive: true });
  return () => window.removeEventListener('scroll', callback);
}, []);
```

**Alternatives Considered**:

- `useEffect` with manual event listener: Works but less idiomatic for React 19
- Lodash throttle/debounce: Adds dependency, unnecessary for this use case
- `requestAnimationFrame`: Overkill for simple visibility toggle

**References**:

- React 19 `useSyncExternalStore` docs
- MDN: Passive event listeners

---

### 2. Smooth Scroll Behavior

**Decision**: Use native `window.scrollTo({ behavior: 'smooth' })` with `prefers-reduced-motion` fallback

**Rationale**:

- Native API is simple and has 95%+ browser support
- Respects user accessibility preferences automatically
- No external dependencies required

**Implementation**:

```typescript
const handleClick = () => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
};
```

**Browser Support**:

- Chrome 61+, Firefox 36+, Safari 15+, Edge 79+
- Fallback to instant scroll (`behavior: 'auto'`) works everywhere

**Alternatives Considered**:

- CSS `scroll-behavior: smooth`: Doesn't work with programmatic scroll
- Custom animation libraries: Unnecessary complexity for this use case

**References**:

- MDN: `Window.scrollTo()`
- MDN: `prefers-reduced-motion` media query

---

### 3. WCAG 2.1 AA Button Requirements

**Decision**: Implement full keyboard support, visible focus, and ARIA labeling

**Requirements**:
| Requirement | Implementation |
| ----------- | -------------- |
| Keyboard accessible | `onClick` + `onKeyDown` (Enter/Space) |
| Visible focus indicator | Tailwind `focus:ring-2 focus:ring-blue-500` |
| Accessible name | `aria-label="Scroll to top"` |
| Sufficient color contrast | Match existing design system (gray/blue) |
| 44px minimum touch target | 40-48px diameter satisfies requirement |

**Implementation**:

```typescript
<button
  type="button"
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  aria-label="Scroll to top"
  className="...focus:ring-2 focus:ring-blue-500..."
>
```

**Alternatives Considered**:

- `role="button"` on div: Semantic `<button>` element preferred
- Icon-only without label: Fails WCAG without `aria-label`

**References**:

- WCAG 2.1 AA Success Criteria 2.1.1 (Keyboard)
- WCAG 2.1 AA Success Criteria 2.4.7 (Focus Visible)
- WCAG 2.1 AA Success Criteria 4.1.2 (Name, Role, Value)

---

### 4. Tailwind CSS 4 Positioning Utilities

**Decision**: Use Tailwind's fixed positioning utilities with responsive breakpoint

**Key Utilities**:
| Utility | CSS |
| ------- | --- |
| `fixed` | `position: fixed` |
| `bottom-4` | `bottom: 1rem` (16px) |
| `right-4` | `right: 1rem` (16px) |
| `xl:block` / `xl:hidden` | Display at XL breakpoint (1280px) |
| `rounded-full` | `border-radius: 9999px` (circular) |
| `h-12 w-12` | `height/width: 3rem` (48px) |

**Responsive Visibility**:

```tsx
<div className="hidden xl:block fixed bottom-4 right-4 ...">
```

**Dark Mode Support**:

```tsx
className =
  'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600';
```

**Alternatives Considered**:

- Custom CSS: Violates constitution (Tailwind only)
- Inline styles: Harder to maintain, no dark mode support

**References**:

- Tailwind CSS 4 docs: Position
- Tailwind CSS 4 docs: Responsive design
- Tailwind CSS 4 docs: Dark mode

---

## Summary of Technical Decisions

| Decision         | Choice                               | Rationale                             |
| ---------------- | ------------------------------------ | ------------------------------------- |
| Scroll listener  | `useSyncExternalStore` + passive     | Matches existing patterns, performant |
| Scroll animation | Native `scrollTo()` + reduced motion | Simple, accessible, no dependencies   |
| Accessibility    | Full WCAG 2.1 AA compliance          | Constitution requirement              |
| Styling          | Tailwind CSS 4 utilities             | Constitution requirement              |
| Icon             | Unicode upward arrow (▲)             | No dependencies, simple               |
| Threshold        | 50vh (dynamic)                       | Responsive, user-friendly             |

## Next Steps

Proceed to Phase 1: Implementation with the above technical decisions.
