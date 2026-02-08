import { act, renderHook } from '@testing-library/react';

import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the default value when key is not in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('returns the stored value when key exists in localStorage', () => {
    localStorage.setItem('testKey', JSON.stringify('stored'));

    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    expect(result.current[0]).toBe('stored');
  });

  it('persists value to localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('testKey')).toBe(JSON.stringify('updated'));
  });

  it('falls back to default when localStorage contains invalid JSON', () => {
    localStorage.setItem('testKey', 'not-valid-json');

    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('works with non-string types', () => {
    const { result } = renderHook(() =>
      useLocalStorage('testKey', { count: 0 }),
    );

    expect(result.current[0]).toEqual({ count: 0 });

    act(() => {
      result.current[1]({ count: 5 });
    });

    expect(result.current[0]).toEqual({ count: 5 });
    expect(localStorage.getItem('testKey')).toBe(JSON.stringify({ count: 5 }));
  });

  it('handles multiple keys independently', () => {
    const { result: result1 } = renderHook(() => useLocalStorage('key1', 'a'));
    const { result: result2 } = renderHook(() => useLocalStorage('key2', 'b'));

    act(() => {
      result1.current[1]('x');
    });

    expect(result1.current[0]).toBe('x');
    expect(result2.current[0]).toBe('b');
  });
});
