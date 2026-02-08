import { diffWords } from 'diff';
import { useMemo } from 'react';
import type { DiffResult, DiffSegment } from 'src/types/diff';

/**
 * Computes a word-level diff between two strings.
 * Returns null when either input is empty (FR-005).
 */
export function useDiff(
  originalText: string,
  modifiedText: string,
): DiffResult | null {
  return useMemo(() => {
    if (!originalText || !modifiedText) {
      return null;
    }

    const changes = diffWords(originalText, modifiedText);

    const segments: DiffSegment[] = changes.map((change) => ({
      value: change.value,
      type: change.added ? 'added' : change.removed ? 'removed' : 'unchanged',
    }));

    const hasChanges = segments.some(
      (segment) => segment.type === 'added' || segment.type === 'removed',
    );

    return { segments, hasChanges };
  }, [originalText, modifiedText]);
}
