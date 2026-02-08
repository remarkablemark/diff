import type { DiffViewerProps } from './DiffViewer.types';

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
    return (
      <div aria-live="polite">
        <div className="grid grid-cols-2 gap-4">
          <div
            data-testid="diff-column-original"
            className="rounded-md border border-gray-300 bg-white p-4 font-mono text-sm whitespace-pre-wrap dark:border-gray-600 dark:bg-gray-800"
          >
            {result.segments.map((segment) => {
              const key = `orig-${segment.type}-${segment.value}`;
              if (segment.type === 'removed') {
                return (
                  <span
                    key={key}
                    className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  >
                    -{segment.value}
                  </span>
                );
              }
              if (segment.type === 'unchanged') {
                return <span key={key}>{segment.value}</span>;
              }
              return null;
            })}
          </div>
          <div
            data-testid="diff-column-modified"
            className="rounded-md border border-gray-300 bg-white p-4 font-mono text-sm whitespace-pre-wrap dark:border-gray-600 dark:bg-gray-800"
          >
            {result.segments.map((segment) => {
              const key = `mod-${segment.type}-${segment.value}`;
              if (segment.type === 'added') {
                return (
                  <span
                    key={key}
                    className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  >
                    +{segment.value}
                  </span>
                );
              }
              if (segment.type === 'unchanged') {
                return <span key={key}>{segment.value}</span>;
              }
              return null;
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div aria-live="polite">
      <div className="flex overflow-hidden rounded-md border border-gray-300 dark:border-gray-600">
        <div
          data-testid="diff-gutter"
          aria-hidden="true"
          className="flex shrink-0 flex-col bg-gray-50 font-mono text-sm leading-6 text-gray-400 select-none dark:bg-gray-800 dark:text-gray-500"
        >
          {result.lines.map((line, i) => {
            const key = `g-${String(i)}-${line.type}`;
            return (
              <div key={key} className="flex">
                <span
                  data-testid="gutter-original"
                  className="inline-block w-10 px-2 text-right"
                >
                  {line.originalLineNumber ?? ''}
                </span>
                <span
                  data-testid="gutter-modified"
                  className="inline-block w-10 px-2 text-right"
                >
                  {line.modifiedLineNumber ?? ''}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex-1 overflow-x-auto bg-white p-0 font-mono text-sm leading-6 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
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
