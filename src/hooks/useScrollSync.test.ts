import { act, renderHook } from '@testing-library/react';

import { type ScrollSyncOptions, useScrollSync } from './useScrollSync';

describe('useScrollSync', () => {
  const mockOptions: ScrollSyncOptions = {
    enabled: true,
    debounceMs: 16,
    smoothScrolling: true,
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default scroll state', () => {
    const { result } = renderHook(() => useScrollSync(mockOptions));

    expect(result.current.scrollState).toEqual({
      scrollTop: 0,
      scrollLeft: 0,
      isScrolling: false,
      source: 'content',
    });
  });

  it('should handle gutter scroll events', () => {
    const { result } = renderHook(() => useScrollSync(mockOptions));
    const mockGutterElement = {
      scrollTop: 100,
      scrollLeft: 50,
    } as HTMLDivElement;

    act(() => {
      result.current.onGutterScroll({
        currentTarget: mockGutterElement,
      } as React.UIEvent<HTMLDivElement>);
    });

    // Need to wait for debounce
    act(() => {
      vi.advanceTimersByTime(16);
    });

    expect(result.current.scrollState).toEqual({
      scrollTop: 100,
      scrollLeft: 50,
      isScrolling: false,
      source: 'gutter',
    });
  });

  it('should handle content scroll events', () => {
    const { result } = renderHook(() => useScrollSync(mockOptions));
    const mockContentElement = {
      scrollTop: 200,
      scrollLeft: 75,
    } as HTMLDivElement;

    act(() => {
      result.current.onContentScroll({
        currentTarget: mockContentElement,
      } as React.UIEvent<HTMLDivElement>);
    });

    // Need to wait for debounce
    act(() => {
      vi.advanceTimersByTime(16);
    });

    expect(result.current.scrollState).toEqual({
      scrollTop: 200,
      scrollLeft: 75,
      isScrolling: false,
      source: 'content',
    });
  });

  it('should debounce scroll events', () => {
    const { result } = renderHook(() => useScrollSync(mockOptions));
    const mockGutterElement = {
      scrollTop: 100,
      scrollLeft: 50,
    } as HTMLDivElement;

    // Fire multiple scroll events rapidly
    act(() => {
      result.current.onGutterScroll({
        currentTarget: Object.assign({}, mockGutterElement, { scrollTop: 100 }),
      } as React.UIEvent<HTMLDivElement>);
      result.current.onGutterScroll({
        currentTarget: Object.assign({}, mockGutterElement, { scrollTop: 150 }),
      } as React.UIEvent<HTMLDivElement>);
      result.current.onGutterScroll({
        currentTarget: Object.assign({}, mockGutterElement, { scrollTop: 200 }),
      } as React.UIEvent<HTMLDivElement>);
    });

    // Should debounce and only capture the last event
    act(() => {
      vi.advanceTimersByTime(16);
    });

    expect(result.current.scrollState.scrollTop).toBe(200);
  });

  it('should return refs for DOM elements', () => {
    const { result } = renderHook(() => useScrollSync(mockOptions));

    expect(result.current.gutterRef).toBeDefined();
    expect(result.current.contentRef).toBeDefined();
    expect(result.current.gutterRef.current).toBeNull();
    expect(result.current.contentRef.current).toBeNull();
  });

  it('should handle disabled state', () => {
    const disabledOptions = { ...mockOptions, enabled: false };
    const { result } = renderHook(() => useScrollSync(disabledOptions));
    const mockGutterElement = {
      scrollTop: 100,
      scrollLeft: 50,
    } as HTMLDivElement;

    act(() => {
      result.current.onGutterScroll({
        currentTarget: mockGutterElement,
      } as React.UIEvent<HTMLDivElement>);
    });

    // Should not update state when disabled
    expect(result.current.scrollState.scrollTop).toBe(0);
  });
});
