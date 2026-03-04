import { Fragment, useRef } from 'react';
import { SideBySideGutter } from 'src/components/SideBySideGutter';
import type { DiffLine } from 'src/types/diff';

import type { DiffViewerProps } from './DiffViewer.types';

interface DiffRowPair {
  original: DiffLine | null;
  modified: DiffLine | null;
}

function pairLines(lines: DiffLine[]): DiffRowPair[] {
  const pairs: DiffRowPair[] = [];
  for (const line of lines) {
    switch (line.type) {
      case 'unchanged':
        pairs.push({ original: line, modified: line });
        break;
      case 'removed':
        pairs.push({ original: line, modified: null });
        break;
      default:
        pairs.push({ original: null, modified: line });
        break;
    }
  }
  return pairs;
}

export default function DiffViewer({
  result,
  viewMode,
  className = '',
}: DiffViewerProps) {
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
    const pairs = pairLines(result.lines);

    return (
      <div aria-live="polite">
        <div className="grid grid-cols-2 gap-4">
          <div
            data-testid="diff-column-original"
            className="flex overflow-hidden rounded-md border border-gray-300 dark:border-gray-600"
          >
            <SideBySideGutter pairs={pairs} column="original" />
            <div className="flex-1 overflow-x-auto bg-white font-mono text-sm leading-6 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
              {pairs.map((pair, index) => {
                if (!pair.original) {
                  return (
                    <div
                      key={`op-${String(index)}`}
                      data-testid="sbs-placeholder"
                      className="bg-gray-100 dark:bg-gray-800"
                    >
                      <span className="px-2">{'\u00A0'}</span>
                    </div>
                  );
                }

                if (pair.original.type === 'removed') {
                  return (
                    <div
                      key={`or-${String(index)}`}
                      className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    >
                      <span className="px-2">-{pair.original.text}</span>
                    </div>
                  );
                }

                return (
                  <div key={`ou-${String(index)}`}>
                    <span className="px-2">{pair.original.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            data-testid="diff-column-modified"
            className="flex overflow-hidden rounded-md border border-gray-300 dark:border-gray-600"
          >
            <SideBySideGutter pairs={pairs} column="modified" />
            <div className="flex-1 overflow-x-auto bg-white font-mono text-sm leading-6 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
              {pairs.map((pair, index) => {
                if (!pair.modified) {
                  return (
                    <div
                      key={`mp-${String(index)}`}
                      data-testid="sbs-placeholder"
                      className="bg-gray-100 dark:bg-gray-800"
                    >
                      <span className="px-2">{'\u00A0'}</span>
                    </div>
                  );
                }
                if (pair.modified.type === 'added') {
                  return (
                    <div
                      key={`ma-${String(index)}`}
                      className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    >
                      <span className="px-2">+{pair.modified.text}</span>
                    </div>
                  );
                }
                return (
                  <div key={`mu-${String(index)}`}>
                    <span className="px-2">{pair.modified.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div aria-live="polite" className={className}>
      <div
        ref={contentRef}
        className="grid h-full grid-cols-[auto_1fr] gap-0 overflow-hidden rounded-md border border-gray-300 dark:border-gray-600"
      >
        {/* Line rows */}
        {result.lines.map((line, index) => {
          const key = `c-${String(index)}-${line.type}`;
          const lineNumber =
            line.originalLineNumber ?? line.modifiedLineNumber ?? '';

          // Determine row styling based on line type
          let numberClasses =
            'border-t border-gray-200 bg-white py-1 pr-2 text-right font-mono text-sm leading-6 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400';
          let contentClasses =
            'border-t border-gray-200 bg-white py-1 pl-2 font-mono text-sm leading-6 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100';

          if (line.type === 'added') {
            numberClasses =
              'border-t border-gray-200 bg-green-50 py-1 pr-2 text-right font-mono text-sm leading-6 text-gray-500 dark:border-gray-700 dark:bg-green-900/20 dark:text-gray-400';
            contentClasses =
              'border-t border-gray-200 bg-green-100 py-1 pl-2 font-mono text-sm leading-6 text-green-800 dark:border-gray-700 dark:bg-green-900/30 dark:text-green-300';
          } else if (line.type === 'removed') {
            numberClasses =
              'border-t border-gray-200 bg-red-50 py-1 pr-2 text-right font-mono text-sm leading-6 text-gray-500 dark:border-gray-700 dark:bg-red-900/20 dark:text-gray-400';
            contentClasses =
              'border-t border-gray-200 bg-red-100 py-1 pl-2 font-mono text-sm leading-6 text-red-800 dark:border-gray-700 dark:bg-red-900/30 dark:text-red-300';
          }

          return (
            <Fragment key={key}>
              {/* Line number cell */}
              <div className={numberClasses}>{lineNumber}</div>
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
