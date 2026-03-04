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
      <div className="overflow-hidden rounded-md border border-gray-300 dark:border-gray-600">
        <div className="bg-white font-mono text-sm leading-6 dark:bg-gray-800">
          {pairs.map((pair, index) => {
            const key = `row-${String(index)}`;
            const originalLineNumber = pair.original?.originalLineNumber ?? '';
            const modifiedLineNumber = pair.modified?.modifiedLineNumber ?? '';

            // Determine row styling for original side
            let origLineNumberClasses =
              'px-2 text-right font-mono text-sm leading-6 text-gray-500 dark:text-gray-400 select-none bg-gray-50 dark:bg-gray-800 align-top';
            let origContentClasses =
              'min-w-0 flex-1 pl-2 font-mono text-sm leading-6 text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words';

            if (!pair.original) {
              // Placeholder for added lines
              origLineNumberClasses += ' bg-gray-100 dark:bg-gray-800';
              origContentClasses += ' bg-gray-100 dark:bg-gray-800';
            } else if (pair.original.type === 'removed') {
              origLineNumberClasses += ' bg-red-50 dark:bg-red-900/20';
              origContentClasses +=
                ' bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            }

            // Determine row styling for modified side
            let modLineNumberClasses =
              'px-2 text-right font-mono text-sm leading-6 text-gray-500 dark:text-gray-400 select-none bg-gray-50 dark:bg-gray-800 align-top';
            let modContentClasses =
              'min-w-0 flex-1 pl-2 font-mono text-sm leading-6 text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words';

            if (!pair.modified) {
              // Placeholder for removed lines
              modLineNumberClasses += ' bg-gray-100 dark:bg-gray-800';
              modContentClasses += ' bg-gray-100 dark:bg-gray-800';
            } else if (pair.modified.type === 'added') {
              modLineNumberClasses += ' bg-green-50 dark:bg-green-900/20';
              modContentClasses +=
                ' bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            }

            return (
              <div key={key} className="flex">
                {/* Original side */}
                <div
                  data-testid="diff-column-original"
                  className="flex w-1/2 border-r border-gray-200 dark:border-gray-700"
                >
                  <div className={origLineNumberClasses}>
                    {originalLineNumber}
                  </div>
                  <div className={origContentClasses}>
                    {!pair.original ? (
                      <span>{'\u00A0'}</span>
                    ) : pair.original.type === 'removed' ? (
                      <span>-{pair.original.text}</span>
                    ) : (
                      <span>{pair.original.text}</span>
                    )}
                  </div>
                </div>

                {/* Modified side */}
                <div data-testid="diff-column-modified" className="flex w-1/2">
                  <div className={modLineNumberClasses}>
                    {modifiedLineNumber}
                  </div>
                  <div className={modContentClasses}>
                    {!pair.modified ? (
                      <span>{'\u00A0'}</span>
                    ) : pair.modified.type === 'added' ? (
                      <span>+{pair.modified.text}</span>
                    ) : (
                      <span>{pair.modified.text}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
