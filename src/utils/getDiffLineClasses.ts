import type { DiffLine } from 'src/types/diff';

interface DiffLineClasses {
  lineNumberClasses: string;
  contentClasses: string;
}

interface GetDiffLineClassesOptions {
  contentBaseClasses?: string;
}

export function getDiffLineClasses(
  lineType: DiffLine['type'] | null,
  options?: GetDiffLineClassesOptions,
): DiffLineClasses {
  const baseLineNumber =
    'w-8 px-2 text-right font-mono text-sm leading-6 text-gray-500 dark:text-gray-400';
  const baseContent =
    options?.contentBaseClasses ??
    'pl-2 font-mono text-sm leading-6 dark:text-gray-100';

  let lineNumberClasses = baseLineNumber;
  let contentClasses = baseContent;

  switch (lineType) {
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

    case null:
      lineNumberClasses += ' bg-gray-100 dark:bg-gray-800';
      contentClasses += ' bg-gray-100 dark:bg-gray-800';
      break;
  }

  return { lineNumberClasses, contentClasses };
}
