# Component API Contracts

**Date**: 2026-02-26  
**Feature**: Line number scrolling synchronization

## LineNumberGutter Component

### Props Interface

```typescript
interface LineNumberGutterProps {
  /** Total number of lines to display */
  lineCount: number;

  /** Current digit width for gutter sizing */
  digitCount: 2 | 3;

  /** Scroll event callback for synchronization */
  onScroll: (scrollTop: number, scrollLeft: number) => void;

  /** Current vertical scroll position (for sync) */
  scrollTop: number;

  /** Current horizontal scroll position (for sync) */
  scrollLeft: number;

  /** Additional CSS classes */
  className?: string;

  /** Accessibility label */
  'aria-label'?: string;
}
```

### Usage Example

```tsx
<LineNumberGutter
  lineCount={150}
  digitCount={3}
  onScroll={handleGutterScroll}
  scrollTop={scrollState.scrollTop}
  scrollLeft={scrollState.scrollLeft}
  aria-label="Line numbers"
  className="line-number-gutter"
/>
```

### Behavior Contract

- **Scroll Events**: Emits `onScroll` callback when user scrolls gutter
- **Width Calculation**: Automatically adjusts width based on `digitCount` prop
- **Accessibility**: Renders with proper ARIA labels and semantic structure
- **Performance**: Uses passive scroll listeners for optimal performance

## DiffViewer Component (Enhanced)

### Props Interface

```typescript
interface DiffViewerProps {
  /** Diff data to display */
  diff: DiffResult;

  /** Diff comparison method */
  method: DiffMethod;

  /** Whether to show line numbers */
  showLineNumbers: boolean;

  /** Enable scroll synchronization (default: true) */
  enableScrollSync?: boolean;

  /** Explicit gutter width control */
  gutterWidth?: 'auto' | 2 | 3;

  /** Additional CSS classes */
  className?: string;
}
```

### Usage Example

```tsx
<DiffViewer
  diff={diffResult}
  method="chars"
  showLineNumbers={true}
  enableScrollSync={true}
  gutterWidth="auto"
  className="diff-viewer"
/>
```

### Behavior Contract

- **Scroll Sync**: Automatically synchronizes gutter and content scrolling when `enableScrollSync` is true
- **Width Management**: Auto-calculates gutter width based on line count unless explicitly set
- **Accessibility**: Maintains native textarea accessibility features
- **Performance**: Optimized scroll event handling with debouncing

## useScrollSync Hook

### Hook Interface

```typescript
interface UseScrollSyncOptions {
  /** Whether synchronization is active */
  enabled: boolean;

  /** Debounce delay for rapid scrolling (default: 16ms) */
  debounceMs?: number;

  /** Enable smooth scrolling behavior (default: true) */
  smoothScrolling?: boolean;
}

interface UseScrollSyncReturn {
  /** Current scroll state */
  scrollState: ScrollSyncState;

  /** Scroll handler for gutter element */
  onGutterScroll: (event: React.UIEvent) => void;

  /** Scroll handler for content element */
  onContentScroll: (event: React.UIEvent) => void;

  /** Ref objects for DOM elements */
  gutterRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLTextAreaElement>;
}
```

### Usage Example

```tsx
const { scrollState, onGutterScroll, onContentScroll, gutterRef, contentRef } =
  useScrollSync({
    enabled: true,
    debounceMs: 16,
    smoothScrolling: true,
  });
```

### Behavior Contract

- **State Management**: Maintains synchronized scroll positions between gutter and content
- **Event Handling**: Provides optimized scroll event handlers with debouncing
- **Ref Management**: Supplies refs for proper DOM element attachment
- **Cleanup**: Automatically cleans up event listeners on unmount

## Tailwind CSS Classes

### Gutter Width Calculation

```tsx
<div className="w-[calc(2ch*var(--digit-count,2))] max-w-[calc(2ch*3)]">
  {/* Line numbers */}
</div>

<div className="w-[calc(2ch*2)]" data-digits="2">
  {/* 2-digit gutter */}
</div>

<div className="w-[calc(2ch*3)]" data-digits="3">
  {/* 3-digit gutter */}
</div>
```

### Scroll Container Styling

```tsx
<div className="grid h-full grid-cols-[auto_1fr] gap-0">
  <div className="bg-secondary col-span-1 overflow-hidden border-r pr-2 text-right font-mono select-none">
    {/* Line number gutter */}
  </div>
  <div className="col-span-2 resize-y overflow-auto">{/* Diff content */}</div>
</div>
```

## Event Contracts

### Scroll Synchronization Events

```typescript
interface ScrollEvent {
  source: 'gutter' | 'content';
  scrollTop: number;
  scrollLeft: number;
  timestamp: number;
}

interface ScrollSyncEvent extends ScrollEvent {
  synchronized: boolean;
  targetElement: 'gutter' | 'content';
}
```

### Width Change Events

```typescript
interface WidthChangeEvent {
  previousWidth: 2 | 3;
  newWidth: 2 | 3;
  lineCount: number;
  reason: 'line-count-change' | 'explicit-prop';
}
```

## Error Handling Contracts

### Scroll Sync Errors

```typescript
interface ScrollSyncError {
  type: 'sync-failure' | 'element-not-found' | 'invalid-scroll-value';
  message: string;
  source: 'gutter' | 'content';
  recoverable: boolean;
}
```

### Width Calculation Errors

```typescript
interface WidthCalculationError {
  type: 'invalid-line-count' | 'digit-calculation-failed';
  lineCount: number;
  fallbackWidth: 2 | 3;
}
```

## Performance Contracts

### Scroll Event Throttling

- Scroll events are throttled to 60fps (16ms intervals)
- Passive event listeners used for optimal performance
- `requestAnimationFrame` for smooth visual updates

### Memory Management

- Event listeners cleaned up on component unmount
- State updates minimized to prevent layout thrashing
- CSS calculations cached to avoid repeated measurements

## Testing Contracts

### Unit Test Coverage

- All components must have 100% test coverage
- Scroll synchronization behavior must be tested with mock events
- Width calculation logic must be tested with various line counts
- Accessibility features must be tested with screen reader simulations

### Integration Test Coverage

- End-to-end scroll synchronization must be tested
- Responsive behavior must be tested across viewport sizes
- Performance must be tested with large diff files
- Error handling must be tested with invalid inputs
