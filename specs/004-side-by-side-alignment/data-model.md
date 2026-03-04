# Data Model: Side-by-Side Diff Alignment

## Types

### DiffRowPair

Represents a single row in the side-by-side diff view.

```typescript
interface DiffRowPair {
  original: DiffLine | null;
  modified: DiffLine | null;
}
```

**Fields:**

- `original` - The diff line to display on the left (original) side, or `null` for placeholder
- `modified` - The diff line to display on the right (modified) side, or `null` for placeholder

## Algorithm: pairLines

Converts a flat array of `DiffLine[]` into paired rows for side-by-side display.

### Input

```typescript
lines: DiffLine[]
```

### Output

```typescript
DiffRowPair[]
```

### Logic Flow

1. **Unchanged lines**: Pair with themselves on both sides

   ```typescript
   { original: line, modified: line }
   ```

2. **Consecutive removed/added lines**: Collect and pair together

   ```typescript
   // Collect all consecutive removed lines
   removedLines = [removed1, removed2, ...]

   // Collect all consecutive added lines that follow
   addedLines = [added1, added2, ...]

   // Pair them using max length
   maxLength = Math.max(removedLines.length, addedLines.length)
   for (k = 0; k < maxLength; k++) {
     pairs.push({
       original: removedLines[k] ?? null,
       modified: addedLines[k] ?? null
     })
   }
   ```

3. **Standalone added lines**: Pair with null on left
   ```typescript
   { original: null, modified: line }
   ```

## Examples

### Example 1: Equal removed/added lines

**Input:**

```typescript
[
  { type: 'removed', text: 'old1' },
  { type: 'removed', text: 'old2' },
  { type: 'added', text: 'new1' },
  { type: 'added', text: 'new2' },
];
```

**Output:**

```typescript
[
  { original: 'old1', modified: 'new1' },
  { original: 'old2', modified: 'new2' },
];
```

### Example 2: More removed than added

**Input:**

```typescript
[
  { type: 'removed', text: 'old1' },
  { type: 'removed', text: 'old2' },
  { type: 'removed', text: 'old3' },
  { type: 'added', text: 'new1' },
];
```

**Output:**

```typescript
[
  { original: 'old1', modified: 'new1' },
  { original: 'old2', modified: null },
  { original: 'old3', modified: null },
];
```

### Example 3: More added than removed

**Input:**

```typescript
[
  { type: 'removed', text: 'old1' },
  { type: 'added', text: 'new1' },
  { type: 'added', text: 'new2' },
  { type: 'added', text: 'new3' },
];
```

**Output:**

```typescript
[
  { original: 'old1', modified: 'new1' },
  { original: null, modified: 'new2' },
  { original: null, modified: 'new3' },
];
```
