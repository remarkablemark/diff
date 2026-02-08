import { act, renderHook } from '@testing-library/react';

import { useMediaQuery } from './useMediaQuery';

interface MockMediaQueryList {
  matches: boolean;
  media: string;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  onchange: null;
  addListener: ReturnType<typeof vi.fn>;
  removeListener: ReturnType<typeof vi.fn>;
  dispatchEvent: ReturnType<typeof vi.fn>;
}

function createMockMatchMedia(matches: boolean) {
  const listeners: ((event: MediaQueryListEvent) => void)[] = [];

  const mediaQueryList: MockMediaQueryList = {
    matches,
    media: '',
    addEventListener: vi.fn(
      (_event: string, handler: (event: MediaQueryListEvent) => void) => {
        listeners.push(handler);
      },
    ),
    removeEventListener: vi.fn(
      (_event: string, handler: (event: MediaQueryListEvent) => void) => {
        const index = listeners.indexOf(handler);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      },
    ),
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };

  const mockMatchMedia = vi.fn().mockReturnValue(mediaQueryList);

  return {
    mockMatchMedia,
    mediaQueryList,
    triggerChange: (newMatches: boolean) => {
      mediaQueryList.matches = newMatches;
      for (const listener of listeners) {
        listener({ matches: newMatches } as MediaQueryListEvent);
      }
    },
  };
}

describe('useMediaQuery', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('returns true when media query matches', () => {
    const { mockMatchMedia } = createMockMatchMedia(true);
    window.matchMedia = mockMatchMedia;

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(true);
    expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)');
  });

  it('returns false when media query does not match', () => {
    const { mockMatchMedia } = createMockMatchMedia(false);
    window.matchMedia = mockMatchMedia;

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);
  });

  it('updates when media query changes', () => {
    const { mockMatchMedia, triggerChange } = createMockMatchMedia(false);
    window.matchMedia = mockMatchMedia;

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);

    act(() => {
      triggerChange(true);
    });

    expect(result.current).toBe(true);
  });

  it('removes event listener on unmount', () => {
    const { mockMatchMedia, mediaQueryList } = createMockMatchMedia(false);
    window.matchMedia = mockMatchMedia;

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    unmount();

    expect(mediaQueryList.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('handles query change by re-subscribing', () => {
    const { mockMatchMedia } = createMockMatchMedia(false);
    window.matchMedia = mockMatchMedia;

    const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: '(min-width: 768px)' },
    });

    rerender({ query: '(min-width: 1024px)' });

    expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
  });
});
