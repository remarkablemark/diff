import { useCallback, useRef, useState } from 'react';
import { LineNumberGutter } from 'src/components/LineNumberGutter';
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
    if (line.type === 'unchanged') {
      pairs.push({ original: line, modified: line });
    } else if (line.type === 'removed') {
      pairs.push({ original: line, modified: null });
    } else {
      pairs.push({ original: null, modified: line });
    }
  }
  return pairs;
}

export default function DiffViewer({
  result,
  viewMode,
  enableScrollSync = true,
  className = '',
}: DiffViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState({ top: 0, left: 0 });

  const handleContentScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const element = event.currentTarget;
      if (enableScrollSync) {
        setScrollPosition({ top: element.scrollTop, left: element.scrollLeft });
      }
    },
    [enableScrollSync],
  );

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
            <SideBySideGutter
              pairs={pairs}
              column="original"
              scrollTop={scrollPosition.top}
            />
            <div className="flex-1 overflow-x-auto bg-white font-mono text-sm leading-6 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
              {pairs.map((pair, i) => {
                if (!pair.original) {
                  return (
                    <div
                      key={`op-${String(i)}`}
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
                      key={`or-${String(i)}`}
                      className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    >
                      <span className="px-2">-{pair.original.text}</span>
                    </div>
                  );
                }
                return (
                  <div key={`ou-${String(i)}`}>
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
            <SideBySideGutter
              pairs={pairs}
              column="modified"
              scrollTop={scrollPosition.top}
            />
            <div className="flex-1 overflow-x-auto bg-white font-mono text-sm leading-6 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
              {pairs.map((pair, i) => {
                if (!pair.modified) {
                  return (
                    <div
                      key={`mp-${String(i)}`}
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
                      key={`ma-${String(i)}`}
                      className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    >
                      <span className="px-2">+{pair.modified.text}</span>
                    </div>
                  );
                }
                return (
                  <div key={`mu-${String(i)}`}>
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
      <div className="grid h-full grid-cols-[auto_1fr] gap-0 overflow-hidden rounded-md border border-gray-300 dark:border-gray-600">
        <LineNumberGutter
          lines={result.lines}
          viewMode="unified"
          scrollTop={scrollPosition.top}
          aria-label="Line numbers"
        />
        <div
          ref={contentRef}
          className="flex-1 overflow-x-auto bg-white p-0 font-mono text-sm leading-6 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          onScroll={handleContentScroll}
        >
          {result.lines.map((line, i) => {
            const key = `c-${String(i)}-${line.type}`;
            if (line.type === 'added') {
              return (
                <div
                  key={key}
                  className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                >
                  <span className="px-2">+{line.text}</span>
                </div>
              );
            }
            if (line.type === 'removed') {
              return (
                <div
                  key={key}
                  className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                >
                  <span className="px-2">-{line.text}</span>
                </div>
              );
            }
            return (
              <div key={key}>
                <span className="px-2">{line.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
