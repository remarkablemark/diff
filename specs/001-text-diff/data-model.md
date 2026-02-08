# Data Model: Text Diff Checker

**Feature Branch**: `001-text-diff`
**Date**: 2026-02-07

## Overview

This is a client-side-only application with no persistence layer. All data exists as in-memory React state and derived values. There are no databases, APIs, or external storage.

## Entities

### 1. TextInput

Represents one of the two user-provided text blocks.

| Field      | Type                       | Description                              |
| ---------- | -------------------------- | ---------------------------------------- |
| `value`    | `string`                   | The raw text content entered by the user |
| `position` | `'original' \| 'modified'` | Which side this input represents         |

**Validation Rules**:

- `value` accepts any valid string including empty string, unicode, emoji, and special characters
- No maximum length enforced at the type level (performance handled at the UI level)

**State Location**: `useState<string>` in the root `App` component (two instances: `originalText` and `modifiedText`)

---

### 2. DiffSegment

A contiguous portion of text within the computed diff result. Maps directly to the `Change` type from the `diff` library.

| Field   | Type                                  | Description                      |
| ------- | ------------------------------------- | -------------------------------- |
| `value` | `string`                              | The text content of this segment |
| `type`  | `'added' \| 'removed' \| 'unchanged'` | The diff classification          |

**Derivation**: Computed from `diffWords(originalText, modifiedText)` → mapped from `Change[]` to `DiffSegment[]`

**Mapping from `diff` library `Change` type**:

- `change.added === true` → `type: 'added'`
- `change.removed === true` → `type: 'removed'`
- Neither `added` nor `removed` → `type: 'unchanged'`

---

### 3. DiffResult

The complete computed comparison between two text inputs.

| Field        | Type            | Description                               |
| ------------ | --------------- | ----------------------------------------- |
| `segments`   | `DiffSegment[]` | Ordered list of diff segments             |
| `hasChanges` | `boolean`       | `true` if any segment is added or removed |

**Derivation**: Computed by the `useDiff` hook from the two input strings. Recomputed on every change (no debounce per FR-004).

**State Transitions**:

- **Empty**: Both inputs are empty → diff output is hidden (FR-005)
- **Partial**: Only one input has content → diff output is hidden (FR-005)
- **Identical**: Both inputs have content and are equal → "No differences found" message (FR-009)
- **Different**: Both inputs have content and differ → rendered diff segments

---

### 4. ViewMode

Controls which diff rendering mode is active.

| Field  | Type                          | Description             |
| ------ | ----------------------------- | ----------------------- |
| `mode` | `'unified' \| 'side-by-side'` | The active display mode |

**State Location**: `useState<ViewMode>` in the root `App` component, default `'unified'`

**Responsive Behavior (FR-003 / FR-010)**:

- On screens below `md:` (768px), the effective view mode is always `'unified'` regardless of state
- The `ViewToggle` component is hidden on screens below `md:`
- The `DiffViewer` receives the effective view mode (state value on desktop, forced `'unified'` on mobile)

---

## Type Definitions

All types will be defined in `src/types/diff.ts`:

```typescript
/** Classification of a diff segment */
type DiffType = 'added' | 'removed' | 'unchanged';

/** A contiguous portion of text within a diff result */
interface DiffSegment {
  /** The text content of this segment */
  value: string;
  /** The diff classification */
  type: DiffType;
}

/** The complete diff computation result */
interface DiffResult {
  /** Ordered list of diff segments */
  segments: DiffSegment[];
  /** True if any segment is added or removed */
  hasChanges: boolean;
}

/** Available diff display modes */
type ViewMode = 'unified' | 'side-by-side';
```

## Relationships

```text
TextInput (original) ──┐
                       ├──→ useDiff hook ──→ DiffResult ──→ DiffViewer
TextInput (modified) ──┘                                       ↑
                                              effectiveViewMode (toggle + media query)
```

- Two `TextInput` values feed into the `useDiff` hook
- `useDiff` returns a `DiffResult` (or `null` when inputs don't meet display criteria)
- `DiffViewer` receives `DiffResult` and the effective `ViewMode` to render the appropriate view
- `ViewToggle` controls the `ViewMode` state (hidden on mobile per FR-003)
- On mobile (<768px), the effective view mode is forced to `'unified'` regardless of toggle state
- Dark mode styling is handled entirely via Tailwind `dark:` variants — no data model impact

## Component Props Interfaces

### TextInputProps

```typescript
interface TextInputProps {
  /** Accessible label for the textarea */
  label: string;
  /** Current text value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
}
```

### DiffViewerProps

```typescript
interface DiffViewerProps {
  /** The computed diff result, null when output should be hidden */
  result: DiffResult | null;
  /** The effective display mode (forced 'unified' on mobile) */
  viewMode: ViewMode;
}
```

### ViewToggleProps

```typescript
interface ViewToggleProps {
  /** The currently active view mode */
  activeMode: ViewMode;
  /** Callback when the user selects a different mode */
  onModeChange: (mode: ViewMode) => void;
}
```

## useDiff Hook

```typescript
/**
 * Computes a word-level diff between two strings.
 * Returns null when either input is empty (FR-005).
 */
function useDiff(originalText: string, modifiedText: string): DiffResult | null;
```

**Behavior**:

- Returns `null` if `originalText` or `modifiedText` is empty → triggers hidden output
- Returns `{ segments: [...], hasChanges: false }` if texts are identical → triggers "No differences found"
- Returns `{ segments: [...], hasChanges: true }` if texts differ → triggers diff rendering

## useMediaQuery Hook

```typescript
/**
 * Returns true when the viewport matches the given media query string.
 * Used to determine effective ViewMode on mobile (FR-003, FR-010).
 */
function useMediaQuery(query: string): boolean;
```

**Usage in App**:

```typescript
const isDesktop = useMediaQuery('(min-width: 768px)');
const effectiveViewMode = isDesktop ? viewMode : 'unified';
```

**Behavior**:

- Listens to `window.matchMedia(query)` change events
- Returns `false` during SSR or when `window` is unavailable (safe default → unified view)
- Updates synchronously on viewport resize
