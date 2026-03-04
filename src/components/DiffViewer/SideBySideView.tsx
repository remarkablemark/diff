import type { DiffLine } from 'src/types/diff';

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

interface SideBySideViewProps {
  lines: DiffLine[];
}

export default function SideBySideView({ lines }: SideBySideViewProps) {
  const pairs = pairLines(lines);

  return (
    <div aria-live="polite">
      <div className="grid grid-cols-2 gap-4">
        {/* Original column */}
        <div
          data-testid="diff-column-original"
          className="overflow-hidden rounded-md border border-gray-300 dark:border-gray-600"
        >
          <div className="bg-white font-mono text-sm leading-6 dark:bg-gray-800">
            {pairs.map((pair, index) => {
              const key = `orig-${String(index)}`;
              const lineNumber = pair.original?.originalLineNumber ?? '';

              // Determine row styling
              let lineNumberClasses =
                'px-2 text-right font-mono text-sm leading-6 text-gray-500 dark:text-gray-400 select-none bg-gray-50 dark:bg-gray-800 align-top';
              let contentClasses =
                'min-w-0 flex-1 pl-2 font-mono text-sm leading-6 text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words';

              if (!pair.original) {
                // Placeholder for added lines
                lineNumberClasses += ' bg-gray-100 dark:bg-gray-800';
                contentClasses += ' bg-gray-100 dark:bg-gray-800';
              } else if (pair.original.type === 'removed') {
                lineNumberClasses += ' bg-red-50 dark:bg-red-900/20';
                contentClasses +=
                  ' bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
              }

              return (
                <div key={key} className="flex">
                  <div className={lineNumberClasses}>{lineNumber}</div>
                  <div className={contentClasses}>
                    {!pair.original ? (
                      <span>{'\u00A0'}</span>
                    ) : pair.original.type === 'removed' ? (
                      <span>-{pair.original.text}</span>
                    ) : (
                      <span>{pair.original.text}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modified column */}
        <div
          data-testid="diff-column-modified"
          className="overflow-hidden rounded-md border border-gray-300 dark:border-gray-600"
        >
          <div className="bg-white font-mono text-sm leading-6 dark:bg-gray-800">
            {pairs.map((pair, index) => {
              const key = `mod-${String(index)}`;
              const lineNumber = pair.modified?.modifiedLineNumber ?? '';

              // Determine row styling
              let lineNumberClasses =
                'px-2 text-right font-mono text-sm leading-6 text-gray-500 dark:text-gray-400 select-none bg-gray-50 dark:bg-gray-800 align-top';
              let contentClasses =
                'min-w-0 flex-1 pl-2 font-mono text-sm leading-6 text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words';

              if (!pair.modified) {
                // Placeholder for removed lines
                lineNumberClasses += ' bg-gray-100 dark:bg-gray-800';
                contentClasses += ' bg-gray-100 dark:bg-gray-800';
              } else if (pair.modified.type === 'added') {
                lineNumberClasses += ' bg-green-50 dark:bg-green-900/20';
                contentClasses +=
                  ' bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
              }

              return (
                <div key={key} className="flex">
                  <div className={lineNumberClasses}>{lineNumber}</div>
                  <div className={contentClasses}>
                    {!pair.modified ? (
                      <span>{'\u00A0'}</span>
                    ) : pair.modified.type === 'added' ? (
                      <span>+{pair.modified.text}</span>
                    ) : (
                      <span>{pair.modified.text}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
