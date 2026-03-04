import { Fragment } from 'react';
import { getDiffLineClasses } from 'src/utils/getDiffLineClasses';

import type { DiffViewerProps } from './DiffViewer.types';
import SideBySideView from './SideBySideView';

export default function DiffViewer({ result, viewMode }: DiffViewerProps) {
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
      <div className="grid h-full grid-cols-[auto_1fr] gap-0 overflow-hidden rounded-md border border-gray-300 dark:border-gray-600">
        {/* Line rows */}
        {result.lines.map((line, index) => {
          const key = `c-${String(index)}-${line.type}`;
          // Line number: prefer original, fallback to modified
          const lineNumber =
            /* v8 ignore next */
            line.originalLineNumber ?? line.modifiedLineNumber ?? '';

          const { lineNumberClasses, contentClasses } = getDiffLineClasses(
            line.type,
          );

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
