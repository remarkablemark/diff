import type { DiffSegment } from 'src/types/diff';

import { segmentsToLines } from './segmentsToLines';

describe('segmentsToLines', () => {
  it('returns empty array for empty segments', () => {
    expect(segmentsToLines([])).toEqual([]);
  });

  it('handles a single unchanged line', () => {
    const segments: DiffSegment[] = [{ value: 'hello', type: 'unchanged' }];
    const lines = segmentsToLines(segments);

    expect(lines).toEqual([
      {
        text: 'hello',
        type: 'unchanged',
        originalLineNumber: 1,
        modifiedLineNumber: 1,
      },
    ]);
  });

  it('splits unchanged multi-line segment by newlines', () => {
    const segments: DiffSegment[] = [
      { value: 'line1\nline2\nline3\n', type: 'unchanged' },
    ];
    const lines = segmentsToLines(segments);

    expect(lines).toEqual([
      {
        text: 'line1',
        type: 'unchanged',
        originalLineNumber: 1,
        modifiedLineNumber: 1,
      },
      {
        text: 'line2',
        type: 'unchanged',
        originalLineNumber: 2,
        modifiedLineNumber: 2,
      },
      {
        text: 'line3',
        type: 'unchanged',
        originalLineNumber: 3,
        modifiedLineNumber: 3,
      },
    ]);
  });

  it('assigns only original line number for removed lines', () => {
    const segments: DiffSegment[] = [{ value: 'removed\n', type: 'removed' }];
    const lines = segmentsToLines(segments);

    expect(lines).toEqual([
      {
        text: 'removed',
        type: 'removed',
        originalLineNumber: 1,
        modifiedLineNumber: undefined,
      },
    ]);
  });

  it('assigns only modified line number for added lines', () => {
    const segments: DiffSegment[] = [{ value: 'added\n', type: 'added' }];
    const lines = segmentsToLines(segments);

    expect(lines).toEqual([
      {
        text: 'added',
        type: 'added',
        originalLineNumber: undefined,
        modifiedLineNumber: 1,
      },
    ]);
  });

  it('tracks line numbers correctly for mixed segments', () => {
    const segments: DiffSegment[] = [
      { value: 'same\n', type: 'unchanged' },
      { value: 'old\n', type: 'removed' },
      { value: 'new\n', type: 'added' },
      { value: 'end\n', type: 'unchanged' },
    ];
    const lines = segmentsToLines(segments);

    expect(lines).toEqual([
      {
        text: 'same',
        type: 'unchanged',
        originalLineNumber: 1,
        modifiedLineNumber: 1,
      },
      {
        text: 'old',
        type: 'removed',
        originalLineNumber: 2,
        modifiedLineNumber: undefined,
      },
      {
        text: 'new',
        type: 'added',
        originalLineNumber: undefined,
        modifiedLineNumber: 2,
      },
      {
        text: 'end',
        type: 'unchanged',
        originalLineNumber: 3,
        modifiedLineNumber: 3,
      },
    ]);
  });

  it('handles multiple removed lines followed by multiple added lines', () => {
    const segments: DiffSegment[] = [
      { value: 'a\nb\n', type: 'removed' },
      { value: 'x\ny\nz\n', type: 'added' },
    ];
    const lines = segmentsToLines(segments);

    expect(lines).toEqual([
      {
        text: 'a',
        type: 'removed',
        originalLineNumber: 1,
        modifiedLineNumber: undefined,
      },
      {
        text: 'b',
        type: 'removed',
        originalLineNumber: 2,
        modifiedLineNumber: undefined,
      },
      {
        text: 'x',
        type: 'added',
        originalLineNumber: undefined,
        modifiedLineNumber: 1,
      },
      {
        text: 'y',
        type: 'added',
        originalLineNumber: undefined,
        modifiedLineNumber: 2,
      },
      {
        text: 'z',
        type: 'added',
        originalLineNumber: undefined,
        modifiedLineNumber: 3,
      },
    ]);
  });

  it('handles segment without trailing newline (single-line input)', () => {
    const segments: DiffSegment[] = [
      { value: 'hello', type: 'unchanged' },
      { value: 'world', type: 'removed' },
      { value: 'there', type: 'added' },
    ];
    const lines = segmentsToLines(segments);

    expect(lines).toEqual([
      {
        text: 'hello',
        type: 'unchanged',
        originalLineNumber: 1,
        modifiedLineNumber: 1,
      },
      {
        text: 'world',
        type: 'removed',
        originalLineNumber: 1,
        modifiedLineNumber: undefined,
      },
      {
        text: 'there',
        type: 'added',
        originalLineNumber: undefined,
        modifiedLineNumber: 1,
      },
    ]);
  });

  it('handles empty string segment', () => {
    const segments: DiffSegment[] = [{ value: '', type: 'unchanged' }];
    const lines = segmentsToLines(segments);

    expect(lines).toEqual([]);
  });

  it('handles segment that is just a newline', () => {
    const segments: DiffSegment[] = [{ value: '\n', type: 'unchanged' }];
    const lines = segmentsToLines(segments);

    expect(lines).toEqual([
      {
        text: '',
        type: 'unchanged',
        originalLineNumber: 1,
        modifiedLineNumber: 1,
      },
    ]);
  });

  it('handles segment ending with multiple newlines', () => {
    const segments: DiffSegment[] = [
      { value: 'line1\n\nline3\n', type: 'unchanged' },
    ];
    const lines = segmentsToLines(segments);

    expect(lines).toEqual([
      {
        text: 'line1',
        type: 'unchanged',
        originalLineNumber: 1,
        modifiedLineNumber: 1,
      },
      {
        text: '',
        type: 'unchanged',
        originalLineNumber: 2,
        modifiedLineNumber: 2,
      },
      {
        text: 'line3',
        type: 'unchanged',
        originalLineNumber: 3,
        modifiedLineNumber: 3,
      },
    ]);
  });

  it('handles mixed segment types with complex line number tracking', () => {
    const segments: DiffSegment[] = [
      { value: 'unchanged1\n', type: 'unchanged' },
      { value: 'removed1\n', type: 'removed' },
      { value: 'removed2\n', type: 'removed' },
      { value: 'added1\n', type: 'added' },
      { value: 'added2\n', type: 'added' },
      { value: 'unchanged2\n', type: 'unchanged' },
    ];
    const lines = segmentsToLines(segments);

    expect(lines).toEqual([
      {
        text: 'unchanged1',
        type: 'unchanged',
        originalLineNumber: 1,
        modifiedLineNumber: 1,
      },
      {
        text: 'removed1',
        type: 'removed',
        originalLineNumber: 2,
        modifiedLineNumber: undefined,
      },
      {
        text: 'removed2',
        type: 'removed',
        originalLineNumber: 3,
        modifiedLineNumber: undefined,
      },
      {
        text: 'added1',
        type: 'added',
        originalLineNumber: undefined,
        modifiedLineNumber: 2,
      },
      {
        text: 'added2',
        type: 'added',
        originalLineNumber: undefined,
        modifiedLineNumber: 3,
      },
      {
        text: 'unchanged2',
        type: 'unchanged',
        originalLineNumber: 4,
        modifiedLineNumber: 4,
      },
    ]);
  });

  it('increments line numbers correctly for unchanged segments with trailing newline', () => {
    const segments: DiffSegment[] = [
      { value: 'line1\nline2\n', type: 'unchanged' },
    ];
    const lines = segmentsToLines(segments);

    expect(lines[0].originalLineNumber).toBe(1);
    expect(lines[0].modifiedLineNumber).toBe(1);
    expect(lines[1].originalLineNumber).toBe(2);
    expect(lines[1].modifiedLineNumber).toBe(2);
  });

  it('increments only original line number for removed segments with trailing newline', () => {
    const segments: DiffSegment[] = [
      { value: 'line1\nline2\n', type: 'removed' },
    ];
    const lines = segmentsToLines(segments);

    expect(lines[0].originalLineNumber).toBe(1);
    expect(lines[0].modifiedLineNumber).toBeUndefined();
    expect(lines[1].originalLineNumber).toBe(2);
    expect(lines[1].modifiedLineNumber).toBeUndefined();
  });

  it('increments only modified line number for added segments with trailing newline', () => {
    const segments: DiffSegment[] = [
      { value: 'line1\nline2\n', type: 'added' },
    ];
    const lines = segmentsToLines(segments);

    expect(lines[0].originalLineNumber).toBeUndefined();
    expect(lines[0].modifiedLineNumber).toBe(1);
    expect(lines[1].originalLineNumber).toBeUndefined();
    expect(lines[1].modifiedLineNumber).toBe(2);
  });
});
