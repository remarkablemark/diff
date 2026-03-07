import { act, renderHook } from '@testing-library/react';

import { useQueryState } from './useQueryState';

describe('useQueryState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.history.replaceState(null, '', '/');
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('User Story 1: Save Application State to URL', () => {
    it('updates URL when state changes (debounced)', () => {
      const { result } = renderHook(() => useQueryState());

      act(() => {
        result.current.updateQueryState({ original: 'test' });
      });

      expect(window.location.search).toBe('');

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(window.location.search).toContain('original=');
    });

    it('updates URL for text changes', () => {
      const { result } = renderHook(() => useQueryState());

      act(() => {
        result.current.updateQueryState({
          original: 'hello',
          modified: 'world',
        });
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const params = new URLSearchParams(window.location.search);
      expect(params.get('original')).toBeTruthy();
      expect(params.get('modified')).toBeTruthy();
    });

    it('updates URL for method changes', () => {
      const { result } = renderHook(() => useQueryState());

      act(() => {
        result.current.updateQueryState({ method: 'lines' });
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const params = new URLSearchParams(window.location.search);
      expect(params.get('method')).toBe('lines');
    });

    it('updates URL for view changes', () => {
      const { result } = renderHook(() => useQueryState());

      act(() => {
        result.current.updateQueryState({ view: 'side-by-side' });
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const params = new URLSearchParams(window.location.search);
      expect(params.get('view')).toBe('side-by-side');
    });

    it('uses replaceState not pushState', () => {
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
      const pushStateSpy = vi.spyOn(window.history, 'pushState');

      const { result } = renderHook(() => useQueryState());

      act(() => {
        result.current.updateQueryState({ method: 'characters' });
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(replaceStateSpy).toHaveBeenCalled();
      expect(pushStateSpy).not.toHaveBeenCalled();
    });

    it('debounces multiple rapid updates', () => {
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

      const { result } = renderHook(() => useQueryState());

      act(() => {
        result.current.updateQueryState({ original: 'a' });
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });

      act(() => {
        result.current.updateQueryState({ original: 'ab' });
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });

      act(() => {
        result.current.updateQueryState({ original: 'abc' });
      });
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(replaceStateSpy).toHaveBeenCalledTimes(1);
      const params = new URLSearchParams(window.location.search);
      expect(params.get('original')).toBeTruthy();
    });

    it('preserves unrelated query parameters', () => {
      window.history.replaceState(null, '', '/?unrelated=value');

      const { result } = renderHook(() => useQueryState());

      act(() => {
        result.current.updateQueryState({ method: 'lines' });
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      const params = new URLSearchParams(window.location.search);
      expect(params.get('method')).toBe('lines');
      expect(params.get('unrelated')).toBe('value');
    });
  });

  describe('User Story 2: Load Application State from URL', () => {
    it('reads initial state from URL on mount', () => {
      window.history.replaceState(
        null,
        '',
        '/?original=test&modified=data&method=lines&view=side-by-side',
      );

      const { result } = renderHook(() => useQueryState());

      expect(result.current.queryState.method).toBe('lines');
      expect(result.current.queryState.view).toBe('side-by-side');
    });

    it('falls back to localStorage for missing parameters', () => {
      localStorage.setItem('diff.diffMethod', JSON.stringify('characters'));
      localStorage.setItem('diff.viewMode', JSON.stringify('side-by-side'));

      const { result } = renderHook(() => useQueryState());

      expect(result.current.queryState.method).toBe('characters');
      expect(result.current.queryState.view).toBe('side-by-side');
    });

    it('URL parameters override localStorage', () => {
      localStorage.setItem('diff.diffMethod', JSON.stringify('characters'));
      window.history.replaceState(null, '', '/?method=lines');

      const { result } = renderHook(() => useQueryState());

      expect(result.current.queryState.method).toBe('lines');
    });

    it('handles corrupted localStorage data gracefully', () => {
      localStorage.setItem('diff.diffMethod', 'invalid-json{');
      localStorage.setItem('diff.viewMode', 'also-invalid}');

      const { result } = renderHook(() => useQueryState());

      expect(result.current.queryState.method).toBe('words');
      expect(result.current.queryState.view).toBe('unified');
    });

    it('handles popstate events (back/forward navigation)', () => {
      const { result } = renderHook(() => useQueryState());

      act(() => {
        window.history.replaceState(null, '', '/?method=lines');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });

      expect(result.current.queryState.method).toBe('lines');
    });
  });

  describe('User Story 3: Handle Invalid or Missing Parameters', () => {
    it('handles missing parameters with defaults', () => {
      const { result } = renderHook(() => useQueryState());

      expect(result.current.queryState.original).toBe('');
      expect(result.current.queryState.modified).toBe('');
      expect(result.current.queryState.method).toBe('words');
      expect(result.current.queryState.view).toBe('unified');
    });

    it('handles invalid method values', () => {
      window.history.replaceState(null, '', '/?method=invalid');

      const { result } = renderHook(() => useQueryState());

      expect(result.current.queryState.method).toBe('words');
    });

    it('handles invalid view values', () => {
      window.history.replaceState(null, '', '/?view=invalid');

      const { result } = renderHook(() => useQueryState());

      expect(result.current.queryState.view).toBe('unified');
    });

    it('handles corrupted compressed data', () => {
      window.history.replaceState(
        null,
        '',
        '/?original=corrupted!!!&modified=bad!!!',
      );

      const { result } = renderHook(() => useQueryState());

      expect(result.current.queryState.original).toBe('');
      expect(result.current.queryState.modified).toBe('');
    });
  });

  describe('URL length warning', () => {
    it('warns when URL exceeds 2000 characters', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {
          return undefined;
        });

      const { result } = renderHook(() => useQueryState());

      const longText = 'abcdefghijklmnopqrstuvwxyz0123456789'.repeat(200);
      act(() => {
        result.current.updateQueryState({
          original: longText,
          modified: longText,
        });
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('URL length'),
      );

      consoleWarnSpy.mockRestore();
    });
  });
});
