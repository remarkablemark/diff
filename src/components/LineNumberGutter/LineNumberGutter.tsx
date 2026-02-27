import { useCallback, useEffect, useMemo, useRef } from 'react';

import type { LineNumberGutterProps } from './LineNumberGutter.types';

export const LineNumberGutter: React.FC<LineNumberGutterProps> = ({
  lineCount,
  digitCount,
  onScroll,
  scrollTop,
  scrollLeft,
  className = '',
  'aria-label': ariaLabel = 'Line numbers',
}) => {
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const element = event.currentTarget;
      onScroll(element.scrollTop, element.scrollLeft);
    },
    [onScroll],
  );

  // Generate line numbers
  const lineNumbers = useMemo(() => {
    return Array.from({ length: lineCount }, (_, index) => index + 1);
  }, [lineCount]);

  // Set scroll position when props change
  const scrollElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* v8 ignore start */
    if (scrollElementRef.current) {
      scrollElementRef.current.scrollTop = scrollTop;
      scrollElementRef.current.scrollLeft = scrollLeft;
    }
    /* v8 ignore end */
  }, [scrollTop, scrollLeft]);

  const widthClass = digitCount === 3 ? 'w-[calc(2ch*3)]' : 'w-[calc(2ch*2)]';

  return (
    <div
      ref={scrollElementRef}
      className={`bg-secondary overflow-hidden border-r pr-2 text-right font-mono select-none ${widthClass} ${className} `}
      onScroll={handleScroll}
      role="generic"
      aria-label={ariaLabel}
      data-digits={digitCount}
    >
      <div className="pointer-events-none">
        {lineNumbers.map((lineNumber) => (
          <div
            key={lineNumber}
            className="text-sm leading-6"
            style={{ height: '24px' }}
          >
            {lineNumber}
          </div>
        ))}
      </div>
    </div>
  );
};
