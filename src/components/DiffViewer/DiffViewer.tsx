import { Fragment, useRef } from 'react';

import type { DiffViewerProps } from './DiffViewer.types';
import SideBySideView from './SideBySideView';

export default function DiffViewer({ result, viewMode }: DiffViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!result) {
    return null;
  }

  if (!result.hasChanges) {
    return (
      <div aria-live="polite">
        <p role="status" className="text-gray-500 dark:text-gray-400">
          No differences found
        </p>
      </div>
    );
  }

  if (viewMode === 'side-by-side') {
    return <SideBySideView lines={result.lines} />;
  }

  return (
    <div aria-live="polite">
      <div
        ref={contentRef}
        className="grid h-full grid-cols-[auto_1fr] gap-0 overflow-hidden rounded-md border border-gray-300 dark:border-gray-600"
      >
        {/* Line rows */}
        {result.lines.map((line, index) => {
          const key = `c-${String(index)}-${line.type}`;
          // Line number: prefer original, fallback to modified
          const lineNumber =
            /* v8 ignore next */
            line.originalLineNumber ?? line.modifiedLineNumber ?? '';

          // Determine row styling based on line type
          let lineNumberClasses =
            'px-2 text-right font-mono text-sm leading-6 text-gray-500 dark:text-gray-400';
          let contentClasses =
            'pl-2 font-mono text-sm leading-6 dark:text-gray-100';

          switch (line.type) {
            case 'added':
              lineNumberClasses += ' bg-green-50 dark:bg-green-900/20';
              contentClasses +=
                ' bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
              break;

            case 'removed':
              lineNumberClasses += ' bg-red-50 dark:bg-red-900/20';
              contentClasses +=
                ' bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
              break;
          }

          return (
            <Fragment key={key}>
              {/* Line number cell */}
              <div className={lineNumberClasses}>{lineNumber}</div>

              {/* Content cell */}
              <div className={contentClasses}>
                {line.type === 'added' && <span className="mr-1">+</span>}
                {line.type === 'removed' && <span className="mr-1">-</span>}
                <span>{line.text}</span>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
