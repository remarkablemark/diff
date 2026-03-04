import { useEffect, useRef } from 'react';

import type { SideBySideGutterProps } from './SideBySideGutter.types';

export function SideBySideGutter({
  pairs,
  column,
  scrollTop,
  className = '',
  'aria-label': ariaLabel = 'Line numbers',
}: SideBySideGutterProps) {
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Sync vertical scroll position
  useEffect(() => {
    /* v8 ignore start */
    if (scrollElementRef.current) {
      scrollElementRef.current.scrollTop = scrollTop;
    }
    /* v8 ignore end */
  }, [scrollTop]);

  return (
    <div
      ref={scrollElementRef}
      data-testid={`sbs-gutter-${column}`}
      aria-hidden="true"
      className={`flex shrink-0 flex-col bg-gray-50 font-mono text-sm leading-6 text-gray-400 select-none dark:bg-gray-800 dark:text-gray-500 ${className}`}
      role="generic"
      aria-label={ariaLabel}
    >
      {pairs.map((pair, i) => {
        const lineNumber =
          column === 'original'
            ? (pair.original?.originalLineNumber ?? '')
            : (pair.modified?.modifiedLineNumber ?? '');

        return (
          <div key={`${column}-${String(i)}`} className="px-2 text-right">
            <span data-testid={`sbs-${column}-line`}>{lineNumber}</span>
          </div>
        );
      })}
    </div>
  );
}
