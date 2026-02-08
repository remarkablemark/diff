import { renderHook } from '@testing-library/react';

import { useDiff } from './useDiff';

describe('useDiff', () => {
  it('returns null when both inputs are empty', () => {
    const { result } = renderHook(() => useDiff('', ''));
    expect(result.current).toBeNull();
  });

  it('returns null when original text is empty', () => {
    const { result } = renderHook(() => useDiff('', 'some text'));
    expect(result.current).toBeNull();
  });

  it('returns null when modified text is empty', () => {
    const { result } = renderHook(() => useDiff('some text', ''));
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

  it('detects added text correctly', () => {
    const { result } = renderHook(() => useDiff('hello', 'hello world'));
    expect(result.current?.hasChanges).toBe(true);

    const addedSegments = result.current?.segments.filter(
      (s) => s.type === 'added',
    );
    expect(addedSegments?.length).toBeGreaterThan(0);
  });

  it('detects removed text correctly', () => {
    const { result } = renderHook(() => useDiff('hello world', 'hello'));
    expect(result.current?.hasChanges).toBe(true);

    const removedSegments = result.current?.segments.filter(
      (s) => s.type === 'removed',
    );
    expect(removedSegments?.length).toBeGreaterThan(0);
  });

  it('handles special characters and unicode', () => {
    const { result } = renderHook(() => useDiff('café ☕', 'café 🍵'));
    expect(result.current).not.toBeNull();
    expect(result.current?.hasChanges).toBe(true);
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
});
