import type { DiffLine, DiffSegment } from 'src/types/diff';

/**
 * Transforms flat DiffSegment[] into line-based DiffLine[] with line number metadata.
 * Splits each segment by newlines and tracks original/modified line counters.
 */
export function segmentsToLines(segments: DiffSegment[]): DiffLine[] {
  const lines: DiffLine[] = [];
  let originalLine = 1;
  let modifiedLine = 1;

  for (const segment of segments) {
    const parts = segment.value.split('\n');

    for (let i = 0; i < parts.length; i++) {
      const isLastPart = i === parts.length - 1;

      if (isLastPart && parts[i] === '') {
        break;
      }

      const line: DiffLine = {
        text: parts[i],
        type: segment.type,
        originalLineNumber: segment.type === 'added' ? undefined : originalLine,
        modifiedLineNumber:
          segment.type === 'removed' ? undefined : modifiedLine,
      };

      lines.push(line);

      if (!isLastPart) {
        if (segment.type !== 'added') {
          originalLine++;
        }
        if (segment.type !== 'removed') {
          modifiedLine++;
        }
      }
    }
  }

  return lines;
}
