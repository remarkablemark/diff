import { act, renderHook } from '@testing-library/react';

import { useScrollPosition } from './useScrollPosition';

describe('useScrollPosition', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const originalScrollY: number | undefined = Object.getOwnPropertyDescriptor(
    window,
    'scrollY',
  )?.value;

  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    if (originalScrollY !== undefined) {
      Object.defineProperty(window, 'scrollY', {
        value: originalScrollY,
        writable: true,
        configurable: true,
      });
    } else {
      Object.defineProperty(window, 'scrollY', {
        value: 0,
        writable: true,
        configurable: true,
      });
    }
  });

  it('returns false when at top of page', () => {
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() =>
      useScrollPosition({ threshold: '50vh' }),
    );

    expect(result.current.isScrolledPastThreshold).toBe(false);
    expect(result.current.scrollY).toBe(0);
  });

  it('returns true when scrolled past threshold', () => {
    Object.defineProperty(window, 'scrollY', {
      value: 500,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() =>
      useScrollPosition({ threshold: '50vh' }),
    );

    // 50vh = 400px, scrollY = 500, so should be past threshold
    expect(result.current.isScrolledPastThreshold).toBe(true);
    expect(result.current.scrollY).toBe(500);
  });

  it('updates when scroll position changes', () => {
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() =>
      useScrollPosition({ threshold: '50vh' }),
    );

    expect(result.current.isScrolledPastThreshold).toBe(false);

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 500,
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isScrolledPastThreshold).toBe(true);
    expect(result.current.scrollY).toBe(500);
  });

  it('removes scroll event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useScrollPosition({ threshold: '50vh' }),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    );
    removeEventListenerSpy.mockRestore();
  });

  it('uses numeric threshold when provided', () => {
    Object.defineProperty(window, 'scrollY', {
      value: 250,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useScrollPosition({ threshold: 200 }));

    // scrollY = 250, threshold = 200, so should be past threshold
    expect(result.current.isScrolledPastThreshold).toBe(true);
    expect(result.current.scrollY).toBe(250);
  });

  it('defaults to 50vh when no options provided', () => {
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useScrollPosition());

    expect(result.current.scrollY).toBe(0);
    expect(result.current.isScrolledPastThreshold).toBe(false);
  });

  it('falls back to pageYOffset when scrollY is zero', () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(
      window,
      'scrollY',
    );

    delete (window as { scrollY?: number }).scrollY;

    Object.defineProperty(window, 'pageYOffset', {
      value: 300,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useScrollPosition({ threshold: 200 }));

    expect(result.current.scrollY).toBe(300);
    expect(result.current.isScrolledPastThreshold).toBe(true);

    if (originalDescriptor) {
      Object.defineProperty(window, 'scrollY', originalDescriptor);
    }
  });
});
