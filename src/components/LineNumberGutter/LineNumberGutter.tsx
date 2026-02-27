import { useEffect, useMemo, useRef } from 'react';

import type { LineNumberGutterProps } from './LineNumberGutter.types';

export const LineNumberGutter: React.FC<LineNumberGutterProps> = ({
  lineCount,
  digitCount,
  scrollTop,
  scrollLeft,
  className = '',
  'aria-label': ariaLabel = 'Line numbers',
}) => {
  // Generate line numbers
  const lineNumbers = useMemo(() => {
    return Array.from({ length: lineCount }, (_, index) => index + 1);
  }, [lineCount]);

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
      data-testid="diff-gutter"
      aria-hidden="true"
      className={`bg-secondary overflow-hidden border-r pr-2 text-right font-mono select-none ${widthClass} ${className} `}
      role="generic"
      aria-label={ariaLabel}
      data-digits={digitCount}
    >
      <div
        className="pointer-events-none"
        style={{ transform: 'translateY(-' + String(scrollTop) + 'px)' }}
      >
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
