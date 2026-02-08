import type { Change } from 'diff';
import { diffChars, diffLines, diffWords } from 'diff';
import { useMemo } from 'react';
import type { DiffMethod, DiffResult, DiffSegment } from 'src/types/diff';

function computeChanges(
  method: DiffMethod,
  oldStr: string,
  newStr: string,
): Change[] {
  switch (method) {
    case 'characters':
      return diffChars(oldStr, newStr);
    case 'lines':
      return diffLines(oldStr, newStr);
    case 'words':
      return diffWords(oldStr, newStr);
  }
}

/**
 * Computes a diff between two strings using the specified method.
 * Returns null when either input is empty (FR-005).
 */
export function useDiff(
  originalText: string,
  modifiedText: string,
  method: DiffMethod = 'words',
): DiffResult | null {
  return useMemo(() => {
    if (!originalText || !modifiedText) {
      return null;
    }

    const changes = computeChanges(method, originalText, modifiedText);

    const segments: DiffSegment[] = changes.map((change) => ({
      value: change.value,
      type: change.added ? 'added' : change.removed ? 'removed' : 'unchanged',
    }));

    const hasChanges = segments.some(
      (segment) => segment.type === 'added' || segment.type === 'removed',
    );

    return { segments, hasChanges };
  }, [originalText, modifiedText, method]);
}
