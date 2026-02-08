import { useCallback, useSyncExternalStore } from 'react';

/**
 * Returns true when the viewport matches the given media query string.
 * Used to determine effective ViewMode on mobile (FR-003, FR-010).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', callback);
      return () => {
        mediaQueryList.removeEventListener('change', callback);
      };
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  /* v8 ignore next -- @preserve */
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
