import { useEffect, useMemo, useRef, useState } from 'react';

import type { LineNumberGutterProps } from './LineNumberGutter.types';

export const LineNumberGutter: React.FC<LineNumberGutterProps> = ({
  lines,
  scrollTop,
  scrollLeft,
  className = '',
  'aria-label': ariaLabel = 'Line numbers',
}) => {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const [hasHorizontalScrollbar, setHasHorizontalScrollbar] = useState(false);

  // Compute digit count from the maximum line number
  const digitCount = useMemo(() => {
    const maxNum = lines.reduce((max, line) => {
      const orig = line.originalLineNumber ?? 0;
      const mod = line.modifiedLineNumber ?? 0;
      return Math.max(max, orig, mod);
    }, 0);
    return maxNum > 99 ? 3 : 2;
  }, [lines]);

  // Check for horizontal scrollbar in the content area
  const checkHorizontalScrollbar = () => {
    const contentElement =
      scrollElementRef.current?.parentElement?.querySelector(
        '[class*="overflow-x-auto"]',
      );
    /* v8 ignore start */
    if (contentElement) {
      const hasScrollbar =
        contentElement.scrollWidth > contentElement.clientWidth;
      setHasHorizontalScrollbar(hasScrollbar);
    }
    /* v8 ignore end */
  };

  useEffect(() => {
    if (scrollElementRef.current) {
      scrollElementRef.current.scrollTop = scrollTop;
      scrollElementRef.current.scrollLeft = scrollLeft;
    }
  }, [scrollTop, scrollLeft]);

  // Check for horizontal scrollbar when scroll position changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkHorizontalScrollbar();
    }, 0);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [scrollLeft]);

  const widthClass =
    digitCount === 3 ? 'w-[calc(2ch*3+1rem)]' : 'w-[calc(2ch*2+1rem)]';

  return (
    <div
      ref={scrollElementRef}
      data-testid="diff-gutter"
      aria-hidden="true"
      className={`bg-secondary overflow-x-hidden overflow-y-auto border-r pr-2 text-right font-mono select-none ${widthClass} ${
        /* v8 ignore start */
        hasHorizontalScrollbar
          ? 'pb-[calc(1.5rem+var(--scrollbar-size,0px))]'
          : ''
        /* v8 ignore end */
      } ${className} `}
      role="generic"
      aria-label={ariaLabel}
      data-digits={digitCount}
    >
      {lines.map((line, index) => {
        const originalNum = line.originalLineNumber ?? '';
        const modifiedNum = line.modifiedLineNumber ?? '';
        const key = `${line.type}-${String(originalNum)}-${String(modifiedNum)}-${String(index)}`;

        return (
          <div
            key={key}
            className="grid grid-cols-2 items-center gap-1 text-sm leading-6"
            style={{ height: '24px' }}
          >
            {/* Original line number column */}
            <span className={originalNum === '' ? 'text-muted-foreground' : ''}>
              {originalNum}
            </span>
            {/* Modified line number column */}
            <span className={modifiedNum === '' ? 'text-muted-foreground' : ''}>
              {modifiedNum}
            </span>
          </div>
        );
      })}
    </div>
  );
};
