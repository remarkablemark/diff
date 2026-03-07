# Quickstart: Fix Line Number Scrolling

**Branch**: `001-fix-line-number-scrolling`  
**Date**: 2026-02-26  
**Status**: Done

## Overview

This feature implements synchronized scrolling between line numbers and diff content in the React diff viewer. The solution uses linked scroll containers with JavaScript scroll event coordination while preserving native textarea functionality.

## Key Components

### 1. LineNumberGutter Component

- **Purpose**: Displays line numbers with synchronized scrolling
- **Location**: `src/components/LineNumberGutter/`
- **Key Features**: Auto-sizing (2-3 digits), monospace font, right-alignment

### 2. useScrollSync Hook

- **Purpose**: Manages scroll synchronization between gutter and content
- **Location**: `src/hooks/useScrollSync.ts`
- **Key Features**: Debounced events, smooth scrolling, performance optimization

### 3. Enhanced DiffViewer Component

- **Purpose**: Main diff viewer with integrated scroll synchronization
- **Location**: `src/components/DiffViewer/`
- **Key Features**: Optional scroll sync, configurable gutter width

## Implementation Steps

### Step 1: Create LineNumberGutter Component

```bash
mkdir -p src/components/LineNumberGutter
touch src/components/LineNumberGutter/LineNumberGutter.tsx
touch src/components/LineNumberGutter/LineNumberGutter.types.ts
touch src/components/LineNumberGutter/LineNumberGutter.test.tsx
touch src/components/LineNumberGutter/index.ts
```

**Key Implementation Points:**

- Use CSS Grid for layout
- Implement scroll event handling
- Add accessibility attributes
- Style with Tailwind CSS utilities

### Step 2: Create useScrollSync Hook

```bash
touch src/hooks/useScrollSync.ts
touch src/hooks/useScrollSync.test.ts
```

**Key Implementation Points:**

- Use `requestAnimationFrame` for smooth updates
- Implement passive event listeners
- Handle scroll direction and source tracking
- Clean up event listeners on unmount

### Step 3: Enhance DiffViewer Component

**Key Implementation Points:**

- Integrate LineNumberGutter component
- Apply useScrollSync hook
- Add configuration props
- Maintain backward compatibility

### Step 4: Add Comprehensive Tests

**Test Coverage Requirements:**

- Unit tests for all new components (100% coverage)
- Integration tests for scroll synchronization
- Accessibility tests with screen reader simulation
- Performance tests with large diff files

## Tailwind CSS Implementation

### Gutter Styling

```tsx
<div className="font-mono text-right pr-2 select-none bg-secondary border-r">
  {/* Line numbers */}
</div>

<div className="w-[calc(2ch*2)]" data-digits="2">
  {/* 2-digit gutter */}
</div>

<div className="w-[calc(2ch*3)]" data-digits="3">
  {/* 3-digit gutter */}
</div>
```

### Container Layout

```tsx
<div className="grid h-full grid-cols-[auto_1fr] gap-0">
  <div className="col-span-1 overflow-hidden">{/* Line number gutter */}</div>
  <div className="col-span-2 resize-y overflow-auto">
    {/* Diff content textarea */}
  </div>
</div>
```

### Responsive Design

```tsx
<div className="grid h-full grid-cols-[auto_1fr] gap-0 sm:gap-0 md:gap-0 lg:gap-0">
  {/* Responsive gutter that works across viewport sizes */}
</div>
```

## Usage Examples

### Basic Usage

```tsx
import { DiffViewer } from 'src/components/DiffViewer';

function App() {
  return (
    <DiffViewer
      diff={diffResult}
      method="chars"
      showLineNumbers={true}
      enableScrollSync={true}
    />
  );
}
```

### Advanced Configuration

```tsx
<DiffViewer
  diff={diffResult}
  method="words"
  showLineNumbers={true}
  enableScrollSync={true}
  gutterWidth="auto"
  className="custom-diff-viewer"
/>
```

### Custom Styling

```tsx
<DiffViewer
  diff={diffResult}
  method="lines"
  showLineNumbers={true}
  className="rounded-lg border shadow-lg"
/>
```

## Testing Strategy

### Unit Tests

```bash
# Run component tests
npm test src/components/LineNumberGutter/LineNumberGutter.test.tsx
npm test src/hooks/useScrollSync.test.ts

# Run with coverage
npm run test:ci src/components/LineNumberGutter/
```

### Integration Tests

```bash
# Run integration tests
npm test src/components/DiffViewer/DiffViewer.test.tsx
```

### Performance Tests

```bash
# Test with large diffs
npm test -- --testNamePattern="large diff performance"
```

## Development Workflow

### 1. Setup Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests in watch mode
npm test -- --watch
```

### 2. Implementation Checklist

- [ ] Create LineNumberGutter component with proper TypeScript interfaces
- [ ] Implement useScrollSync hook with performance optimizations
- [ ] Enhance DiffViewer component with scroll synchronization
- [ ] Add comprehensive unit tests (100% coverage)
- [ ] Add integration tests for scroll behavior
- [ ] Test accessibility with screen reader
- [ ] Verify performance with large diff files
- [ ] Test responsive behavior across viewport sizes

### 3. Quality Gates

Before submitting PR, ensure all quality gates pass:

```bash
# Lint code
npm run lint

# Type check
npm run lint:tsc

# Run tests with coverage
npm run test:ci

# Build production version
npm run build
```

## Troubleshooting

### Common Issues

**Scroll sync not working:**

- Check that both elements have proper refs attached
- Verify scroll event listeners are properly added
- Ensure `enableScrollSync` prop is true

**Gutter width incorrect:**

- Verify digit count calculation logic
- Check CSS custom properties are applied
- Ensure line count is calculated correctly

**Performance issues:**

- Verify passive event listeners are used
- Check that scroll events are debounced
- Ensure `requestAnimationFrame` is used for updates

**Accessibility issues:**

- Verify ARIA labels are present
- Check keyboard navigation works
- Test with screen reader software

## Performance Considerations

### Scroll Event Optimization

- Use passive event listeners: `{ passive: true }`
- Debounce scroll events to 60fps (16ms)
- Use `requestAnimationFrame` for visual updates
- Clean up event listeners on unmount

### Memory Management

- Minimize state updates during scrolling
- Use CSS transforms instead of layout changes
- Cache calculated values to avoid repeated measurements
- Implement proper cleanup in useEffect hooks

### Bundle Size Optimization

- No additional runtime dependencies
- Use native browser APIs
- Minimal JavaScript for scroll coordination
- Leverage existing Tailwind CSS utilities

## Browser Compatibility

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Features

- CSS Grid Layout
- CSS Custom Properties
- Passive Event Listeners
- requestAnimationFrame
- ResizeObserver

## Next Steps

After implementation:

1. **Testing**: Comprehensive test coverage including edge cases
2. **Performance**: Verify smooth scrolling with large diffs
3. **Accessibility**: Test with screen readers and keyboard navigation
4. **Documentation**: Update component documentation and examples
5. **Deployment**: Verify production build and deployment

## Related Documentation

- [Component API Contracts](./contracts/component-apis.md)
- [Data Model](./data-model.md)
- [Research Findings](./research.md)
- [Main Specification](./spec.md)
