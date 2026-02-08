# Data Model: Toggle Diff Options

**Feature Branch**: `002-toggle-diff-options`
**Date**: 2026-02-08

## Overview

This feature adds one new type (`DiffMethod`) and one new hook (`useLocalStorage`) to the existing client-side data model. All data remains in-memory React state with optional localStorage persistence. No databases, APIs, or external storage.

## New Entities

### DiffMethod

The granularity of comparison. A string union type with three possible values.

- `'characters'` — character-level diff (`diffChars`)
- `'words'` — word-level diff (`diffWords`, current default)
- `'lines'` — line-level diff (`diffLines`)

**Default**: `'words'` (preserves current behavior)
**Persistence**: localStorage key `'diffMethod'`

## Modified Entities

### DiffResult (no structural change)

The `DiffResult` interface (`segments` + `hasChanges`) remains unchanged. The diff method only affects which library function produces the segments — the output shape is identical across `diffChars`, `diffWords`, and `diffLines`.

### ViewMode (no structural change)

The `ViewMode` type (`'unified' | 'side-by-side'`) remains unchanged. It gains localStorage persistence via the same `useLocalStorage` hook.

**Persistence**: localStorage key `'viewMode'`

## Hooks

### useLocalStorage<T>(key, defaultValue) → [T, (value: T) => void]

A generic hook that mirrors `useState` but reads the initial value from localStorage and writes on every update.

- **key**: localStorage key string
- **defaultValue**: fallback when key is missing or value is invalid
- **Returns**: `[currentValue, setValue]` tuple (same shape as `useState`)
- **Error handling**: Falls back to `defaultValue` if localStorage read fails or JSON parsing throws

### useDiff(originalText, modifiedText, method) → DiffResult | null

Modified to accept a third parameter `method: DiffMethod` that selects which diff function to call.

- `'characters'` → `diffChars(original, modified)`
- `'words'` → `diffWords(original, modified)` (current behavior)
- `'lines'` → `diffLines(original, modified)`

## Component Props

### DiffMethodToggleProps

```
activeMethod: DiffMethod     — the currently selected diff method
onMethodChange: (method: DiffMethod) => void  — callback when user selects a method
```

## localStorage Schema

| Key          | Type         | Default     | Description                          |
| ------------ | ------------ | ----------- | ------------------------------------ |
| `diffMethod` | `DiffMethod` | `'words'`   | Selected diff comparison granularity |
| `viewMode`   | `ViewMode`   | `'unified'` | Selected diff display mode           |
