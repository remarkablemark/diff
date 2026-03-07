import { renderHook } from '@testing-library/react';

import { useDiff } from './useDiff';

describe('useDiff', () => {
  it('returns null when both inputs are empty', () => {
    const { result } = renderHook(() => useDiff('', ''));
    expect(result.current).toBeNull();
  });

  it('returns hasChanges false when texts are identical', () => {
    const { result } = renderHook(() => useDiff('hello world', 'hello world'));
    expect(result.current).not.toBeNull();
    expect(result.current?.hasChanges).toBe(false);
    expect(result.current?.segments).toEqual([
      { value: 'hello world', type: 'unchanged' },
    ]);
  });

  it('returns correct segments for different texts', () => {
    const { result } = renderHook(() => useDiff('hello world', 'hello there'));
    expect(result.current).not.toBeNull();
    expect(result.current?.hasChanges).toBe(true);

    const segments = result.current?.segments ?? [];
    expect(segments.length).toBeGreaterThan(1);

    const hasAdded = segments.some((s) => s.type === 'added');
    const hasRemoved = segments.some((s) => s.type === 'removed');
    const hasUnchanged = segments.some((s) => s.type === 'unchanged');

    expect(hasAdded).toBe(true);
    expect(hasRemoved).toBe(true);
    expect(hasUnchanged).toBe(true);
  });

  it('memoizes result for same inputs', () => {
    const { result, rerender } = renderHook(
      ({ original, modified }) => useDiff(original, modified),
      { initialProps: { original: 'hello', modified: 'world' } },
    );

    const firstResult = result.current;
    rerender({ original: 'hello', modified: 'world' });
    expect(result.current).toBe(firstResult);
  });

  it('computes character-level diff when method is "characters"', () => {
    const { result } = renderHook(() => useDiff('abc', 'aXc', 'characters'));
    expect(result.current?.hasChanges).toBe(true);

    const segments = result.current?.segments ?? [];
    const removed = segments.filter((s) => s.type === 'removed');
    const added = segments.filter((s) => s.type === 'added');
    expect(removed).toEqual([{ value: 'b', type: 'removed' }]);
    expect(added).toEqual([{ value: 'X', type: 'added' }]);
  });

  it('computes line-level diff when method is "lines"', () => {
    const { result } = renderHook(() =>
      useDiff('line1\nline2\n', 'line1\nchanged\n', 'lines'),
    );
    expect(result.current?.hasChanges).toBe(true);

    const segments = result.current?.segments ?? [];
    const removed = segments.filter((s) => s.type === 'removed');
    const added = segments.filter((s) => s.type === 'added');
    expect(removed[0]?.value).toContain('line2');
    expect(added[0]?.value).toContain('changed');
  });

  it('defaults to word-level diff when method is omitted', () => {
    const withMethod = renderHook(() =>
      useDiff('hello world', 'hello there', 'words'),
    );
    const withoutMethod = renderHook(() =>
      useDiff('hello world', 'hello there'),
    );
    expect(withMethod.result.current?.segments).toEqual(
      withoutMethod.result.current?.segments,
    );
  });

  it('returns correct lines array with line numbers', () => {
    const { result } = renderHook(() => useDiff('hello world', 'hello world'));
    expect(result.current?.lines).toBeDefined();
    expect(result.current?.lines.length).toBeGreaterThan(0);

    const { result: diffResult } = renderHook(() =>
      useDiff('line1\nline2\n', 'line1\nchanged\n', 'lines'),
    );
    const lines = diffResult.current?.lines ?? [];

    const unchanged = lines.filter((l) => l.type === 'unchanged');
    expect(unchanged[0]).toMatchObject({
      text: 'line1',
      originalLineNumber: 1,
      modifiedLineNumber: 1,
    });

    const removed = lines.filter((l) => l.type === 'removed');
    expect(removed[0]).toMatchObject({
      originalLineNumber: 2,
      modifiedLineNumber: undefined,
    });

    const added = lines.filter((l) => l.type === 'added');
    expect(added[0]).toMatchObject({
      originalLineNumber: undefined,
      modifiedLineNumber: 2,
    });
  });

  it('returns lines for character-level diff with newlines', () => {
    const { result } = renderHook(() =>
      useDiff('a\nb\n', 'a\nc\n', 'characters'),
    );
    const lines = result.current?.lines ?? [];
    expect(lines.length).toBeGreaterThan(0);
    expect(lines[0]?.originalLineNumber).toBe(1);
  });

  it('returns null when original text is empty', () => {
    const { result } = renderHook(() => useDiff('', 'some text'));
    expect(result.current).toBeNull();
  });

  it('returns null when modified text is empty', () => {
    const { result } = renderHook(() => useDiff('some text', ''));
    expect(result.current).toBeNull();
  });

  it('handles changes with all segment types (added, removed, unchanged)', () => {
    const { result } = renderHook(() =>
      useDiff('keep this remove', 'keep this add', 'words'),
    );
    const segments = result.current?.segments ?? [];

    expect(segments.some((s) => s.type === 'unchanged')).toBe(true);
    expect(segments.some((s) => s.type === 'added')).toBe(true);
    expect(segments.some((s) => s.type === 'removed')).toBe(true);
  });
});
