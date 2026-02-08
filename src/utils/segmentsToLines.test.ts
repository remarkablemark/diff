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
});
