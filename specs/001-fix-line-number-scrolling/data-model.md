# Data Model: Fix Line Number Scrolling

**Date**: 2026-02-26  
**Feature**: Line number scrolling synchronization  
**Status**: Done

## Core Entities

### ScrollSyncState

State management for scroll synchronization between gutter and content.

```typescript
interface ScrollSyncState {
  scrollTop: number; // Current vertical scroll position
  scrollLeft: number; // Current horizontal scroll position
  isScrolling: boolean; // Scroll in progress flag
  source: 'gutter' | 'content'; // Source of current scroll event
}
```

### LineNumberGutterProps

Properties for the line number gutter component.

```typescript
interface LineNumberGutterProps {
  lineCount: number; // Total number of lines to display
  digitCount: 2 | 3; // Current digit width (2 or 3)
  onScroll: (scrollTop: number, scrollLeft: number) => void; // Scroll callback
  scrollTop: number; // Current scroll position (for sync)
  scrollLeft: number; // Current horizontal scroll position
  className?: string; // Additional CSS classes
}
```

### DiffViewerProps

Enhanced properties for the diff viewer component.

```typescript
interface DiffViewerProps {
  // Existing props from current implementation
  diff: DiffResult;
  method: DiffMethod;
  showLineNumbers: boolean;

  // New props for scroll synchronization
  enableScrollSync?: boolean; // Enable/disable scroll sync (default: true)
  gutterWidth?: 'auto' | 2 | 3; // Control gutter width explicitly
}
```

### ScrollSyncOptions

Configuration options for the scroll synchronization hook.

```typescript
interface ScrollSyncOptions {
  enabled: boolean; // Whether synchronization is active
  debounceMs?: number; // Debounce delay for rapid scrolling (default: 16ms)
  smoothScrolling?: boolean; // Enable smooth scrolling behavior (default: true)
}
```

## State Transitions

### Scroll Event Flow

```
User scrolls gutter → Update gutter scroll state → Sync content scroll position
User scrolls content → Update content scroll state → Sync gutter scroll position
```

### Width Calculation Flow

```
Line count changes → Calculate digit count → Update gutter width → Re-render components
```

## Validation Rules

### ScrollSyncState Validation

- `scrollTop` must be >= 0
- `scrollLeft` must be >= 0
- `isScrolling` must be boolean
- `source` must be either 'gutter' or 'content'

### LineNumberGutterProps Validation

- `lineCount` must be >= 0
- `digitCount` must be 2 or 3
- `onScroll` must be a function
- `scrollTop` and `scrollLeft` must be >= 0

### Digit Count Calculation

```typescript
const calculateDigitCount = (lineCount: number): 2 | 3 => {
  return lineCount >= 100 ? 3 : 2;
};
```

## Relationships

### Component Hierarchy

```
DiffViewer
├── LineNumberGutter (synced scroll)
└── textarea (synced scroll)
```

### Hook Dependencies

```
useScrollSync
├── manages ScrollSyncState
├── coordinates between gutter and content
└── provides scroll event handlers
```

## Data Flow

### Initialization

1. DiffViewer receives diff data
2. Calculate line count from diff
3. Determine digit count (2 or 3)
4. Initialize scroll sync state
5. Render gutter and content with sync enabled

### Scroll Synchronization

1. User scrolls either gutter or content
2. Scroll event captured by useScrollSync hook
3. Update ScrollSyncState with new positions
4. Apply scroll position to opposite container
5. Re-render both components with synchronized positions

### Width Adjustment

1. Diff data changes (new line count)
2. Recalculate digit count
3. Update gutter CSS width
4. Maintain scroll positions during resize

## Performance Considerations

### State Updates

- Scroll state updates use `requestAnimationFrame` for smooth 60fps
- Debounced scroll events prevent excessive re-renders
- Passive event listeners maintain scroll performance

### Memory Management

- Scroll event listeners cleaned up on component unmount
- State updates minimized to prevent layout thrashing
- CSS calculations cached to avoid repeated measurements

## Error Handling

### Scroll Sync Failures

- Graceful degradation if scroll events fail
- Fallback to independent scrolling if sync breaks
- Console warnings for debugging sync issues

### Width Calculation Errors

- Default to 2-digit width if calculation fails
- Validate line count before digit calculation
- Prevent negative or infinite values
