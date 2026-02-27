/**
 * Scroll synchronization hook for coordinating line number gutter and textarea scrolling
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ScrollSyncState {
  /** Current vertical scroll position */
  scrollTop: number;
  /** Current horizontal scroll position */
  scrollLeft: number;
  /** Scroll in progress flag */
  isScrolling: boolean;
  /** Source of current scroll event */
  source: 'gutter' | 'content';
}

export interface ScrollSyncOptions {
  /** Whether synchronization is active */
  enabled: boolean;
  /** Debounce delay for rapid scrolling (default: 16ms) */
  debounceMs?: number;
  /** Enable smooth scrolling behavior (default: true) */
  smoothScrolling?: boolean;
}

export interface UseScrollSyncReturn {
  /** Current scroll state */
  scrollState: ScrollSyncState;
  /** Scroll handler for gutter element */
  onGutterScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  /** Scroll handler for content element */
  onContentScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  /** Ref objects for DOM elements */
  gutterRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export const useScrollSync = (
  options: ScrollSyncOptions,
): UseScrollSyncReturn => {
  const { enabled, debounceMs = 16 } = options;

  const [scrollState, setScrollState] = useState<ScrollSyncState>({
    scrollTop: 0,
    scrollLeft: 0,
    isScrolling: false,
    source: 'content',
  });

  const gutterRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<number>(null);

  const syncScrollPosition = useCallback(
    (scrollTop: number, scrollLeft: number, source: 'gutter' | 'content') => {
      if (!enabled) return;

      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Debounce the scroll update
      debounceTimeoutRef.current = window.setTimeout(() => {
        setScrollState({
          scrollTop,
          scrollLeft,
          isScrolling: false,
          source,
        });

        // Sync the opposite element
        /* v8 ignore start */
        if (source === 'gutter' && contentRef.current) {
          contentRef.current.scrollTop = scrollTop;
          contentRef.current.scrollLeft = scrollLeft;
        } else if (source === 'content' && gutterRef.current) {
          gutterRef.current.scrollTop = scrollTop;
          gutterRef.current.scrollLeft = scrollLeft;
        }
        /* v8 ignore end */
      }, debounceMs);
    },
    [enabled, debounceMs],
  );

  const onGutterScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const element = event.currentTarget;
      syncScrollPosition(element.scrollTop, element.scrollLeft, 'gutter');
    },
    [syncScrollPosition],
  );

  const onContentScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const element = event.currentTarget;
      syncScrollPosition(element.scrollTop, element.scrollLeft, 'content');
    },
    [syncScrollPosition],
  );

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollState,
    onGutterScroll,
    onContentScroll,
    gutterRef,
    contentRef,
  };
};
