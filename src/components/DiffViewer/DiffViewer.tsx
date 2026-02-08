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
      <div className="rounded-md border border-gray-300 bg-white p-4 font-mono text-sm whitespace-pre-wrap dark:border-gray-600 dark:bg-gray-800">
        {result.segments.map((segment) => {
          const key = `${segment.type}-${segment.value}`;
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
          return <span key={key}>{segment.value}</span>;
        })}
      </div>
    </div>
  );
}
