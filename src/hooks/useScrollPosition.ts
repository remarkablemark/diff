import { useCallback, useRef, useSyncExternalStore } from 'react';

interface UseScrollPositionOptions {
  /** Scroll threshold for visibility (e.g., '50vh' or numeric pixels) */
  threshold: number | '50vh';
}

interface UseScrollPositionReturn {
  /** Whether the page is scrolled past the threshold */
  isScrolledPastThreshold: boolean;
  /** Current vertical scroll position in pixels */
  scrollY: number;
}

/**
 * Tracks scroll position and returns whether scrolled past a threshold.
 * Uses passive event listener for performance.
 */
export function useScrollPosition(
  options?: UseScrollPositionOptions,
): UseScrollPositionReturn {
  const threshold = options?.threshold ?? '50vh';
  const snapshotRef = useRef<{
    scrollY: number;
    isScrolledPastThreshold: boolean;
  } | null>(null);

  const getThresholdInPixels = useCallback((): number => {
    if (threshold === '50vh') {
      return window.innerHeight / 2;
    }
    return threshold;
  }, [threshold]);

  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('scroll', callback, { passive: true });
    return (): void => {
      window.removeEventListener('scroll', callback);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const thresholdPx = getThresholdInPixels();
    const isScrolledPastThreshold = scrollY > thresholdPx;

    // Cache the snapshot to avoid infinite loops
    if (
      snapshotRef.current?.scrollY !== scrollY ||
      snapshotRef.current.isScrolledPastThreshold !== isScrolledPastThreshold
    ) {
      snapshotRef.current = { scrollY, isScrolledPastThreshold };
    }

    return snapshotRef.current;
  }, [getThresholdInPixels]);

  /* v8 ignore next -- @preserve */
  const getServerSnapshot = useCallback(
    () => ({ scrollY: 0, isScrolledPastThreshold: false }),
    [],
  );

  const { scrollY, isScrolledPastThreshold } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return { scrollY, isScrolledPastThreshold };
}
