# Research: Fix Line Number Scrolling

**Date**: 2026-02-26  
**Feature**: Line number scrolling synchronization  
**Status**: Done

## Scroll Event Synchronization

**Decision**: Use native browser scroll events with `addEventListener` and `scrollTop`/`scrollLeft` properties  
**Rationale**:

- Most performant approach with minimal JavaScript overhead
- Native browser events provide smooth 60fps scrolling
- No additional dependencies required
- Preserves native textarea scrolling behavior

**Implementation**: Create a custom hook `useScrollSync` that:

1. Attaches scroll event listeners to both gutter and textarea containers
2. Synchronizes `scrollTop` and `scrollLeft` values between containers
3. Uses `requestAnimationFrame` for smooth updates
4. Handles edge cases (scroll boundaries, rapid scrolling)

**Alternatives considered**:

- Intersection Observer API: Not suitable for scroll synchronization
- CSS-only solutions: Cannot synchronize independent scroll containers
- Third-party libraries: Unnecessary complexity for this use case

## Line Number Gutter Layout

**Decision**: Use CSS Grid with fixed column for gutter and flexible column for content  
**Rationale**:

- Perfect alignment control between gutter and content
- Responsive design support
- Minimal layout reflow during scrolling
- Compatible with existing Tailwind CSS utilities

**Implementation**:

```tsx
<div className="grid h-full grid-cols-[auto_1fr] gap-0">
  <div className="col-span-1 overflow-hidden">{/* Line number gutter */}</div>
  <div className="col-span-2 overflow-auto">{/* Diff content */}</div>
</div>
```

**Alternatives considered**:

- Flexbox: Less precise column control
- Table layout: Not suitable for textarea content
- Absolute positioning: Complex responsive behavior

## Dynamic Width Calculation

**Decision**: Calculate gutter width based on maximum line number digits  
**Rationale**:

- Efficient use of screen space
- Scales appropriately with content size
- Simple implementation with CSS `ch` units

**Implementation**:

```tsx
<div className="w-[calc(2ch*var(--digit-count,2))] max-w-[calc(2ch*3)]">
  {/* Line numbers */}
</div>

// Or with data attributes
<div className="w-[calc(2ch*2)]" data-digits="2">
  {/* 2-digit gutter */}
</div>
```

**Alternatives considered**:

- Fixed width: Wastes space for small diffs
- JavaScript measurement: Unnecessary complexity
- CSS `fit-content`: Inconsistent cross-browser behavior

## Performance Optimization

**Decision**: Use passive event listeners and debounced resize handlers  
**Rationale**:

- Prevents scroll performance degradation
- Smooth scrolling experience
- Minimal memory footprint

**Implementation**:

```javascript
element.addEventListener('scroll', handler, { passive: true });
```

**Alternatives considered**:

- Throttling: Can cause visual lag
- No optimization: Potential performance issues with large diffs

## Accessibility Considerations

**Decision**: Preserve native textarea accessibility and add ARIA labels for gutter  
**Rationale**:

- Maintains screen reader compatibility
- Keyboard navigation preserved
- No accessibility regression

**Implementation**:

- Keep textarea as primary content element
- Add `aria-label="Line numbers"` to gutter container
- Ensure proper focus management
- Maintain semantic HTML structure

**Alternatives considered**:

- Custom implementation: Would lose native accessibility
- ARIA live regions: Unnecessary for static line numbers

## Browser Compatibility

**Decision**: Target modern browsers with ES2020+ features  
**Rationale**:

- Consistent with existing project constraints
- Scroll events and CSS Grid widely supported
- No polyfills required

**Implementation**: Use standard DOM APIs and CSS Grid without fallbacks

**Alternatives considered**:

- Legacy browser support: Not required by project constraints
- Polyfills: Unnecessary bundle size increase
