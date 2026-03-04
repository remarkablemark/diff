# Quickstart: Side-by-Side Diff Alignment

## What Changed

The side-by-side diff view now aligns consecutive removed and added lines on the same row, making it easier to see what changed between the original and modified versions.

## Example

**Before:**

```
Row 1: [Line 3: removed text]     [empty]
Row 2: [empty]                    [Line 3: added text]
```

**After:**

```
Row 1: [Line 3: removed text]     [Line 3: added text]
```

## Testing

Run the test suite:

```bash
npm run test:ci
```

Expected: All 113 tests pass with 100% coverage

## Manual Testing

1. Start the dev server:

   ```bash
   npm start
   ```

2. Enter text with changes in both input areas

3. Switch to "Side-by-Side" view

4. Observe that removed lines (red, left side) align horizontally with added lines (green, right side)

## Key Files

- `src/components/DiffViewer/SideBySideView.tsx` - Implementation
- `src/components/DiffViewer/SideBySideView.test.tsx` - Tests
