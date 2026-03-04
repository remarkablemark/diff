import { render } from '@testing-library/react';
import type { DiffLineResult } from 'src/types/diff';
import { segmentsToLines } from 'src/utils/segmentsToLines';

import SideBySideView from './SideBySideView';

function makeResult(
  segments: DiffLineResult['segments'],
  hasChanges: boolean,
): DiffLineResult {
  return { segments, hasChanges, lines: segmentsToLines(segments) };
}

describe('SideBySideView component', () => {
  it('renders side-by-side view correctly', () => {
    const result = makeResult(
      [
        { value: 'hello ', type: 'unchanged' },
        { value: 'world', type: 'removed' },
        { value: 'there', type: 'added' },
      ],
      true,
    );

    const { container } = render(<SideBySideView lines={result.lines} />);

    const diffOutput = container.querySelector('[aria-live="polite"]');
    expect(diffOutput).toBeInTheDocument();

    const originalColumns = container.querySelectorAll(
      '[data-testid="diff-column-original"]',
    );
    expect(originalColumns.length).toBe(2);

    const modifiedColumns = container.querySelectorAll(
      '[data-testid="diff-column-modified"]',
    );
    expect(modifiedColumns.length).toBe(2);
  });

  it('renders line number gutters in side-by-side view', () => {
    const result = makeResult(
      [
        { value: 'same\n', type: 'unchanged' },
        { value: 'old\n', type: 'removed' },
        { value: 'new\n', type: 'added' },
      ],
      true,
    );

    const { container } = render(<SideBySideView lines={result.lines} />);

    // Check for rows with both original and modified columns
    const originalColumns = container.querySelectorAll(
      '[data-testid="diff-column-original"]',
    );
    expect(originalColumns.length).toBe(2);

    const modifiedColumns = container.querySelectorAll(
      '[data-testid="diff-column-modified"]',
    );
    expect(modifiedColumns.length).toBe(2);
  });

  it('shows correct line numbers in side-by-side original column', () => {
    const result = makeResult(
      [
        { value: 'same\n', type: 'unchanged' },
        { value: 'old\n', type: 'removed' },
      ],
      true,
    );

    const { container } = render(<SideBySideView lines={result.lines} />);

    const originalColumns = container.querySelectorAll(
      '[data-testid="diff-column-original"]',
    );
    expect(originalColumns).toHaveLength(2);

    // Check line numbers and content in original column
    expect(originalColumns[0].textContent).toBe('1same');
    expect(originalColumns[1].textContent).toBe('2-old');
  });

  it('shows correct line numbers in side-by-side modified column', () => {
    const result = makeResult(
      [
        { value: 'same\n', type: 'unchanged' },
        { value: 'new\n', type: 'added' },
      ],
      true,
    );

    const { container } = render(<SideBySideView lines={result.lines} />);

    const modifiedColumns = container.querySelectorAll(
      '[data-testid="diff-column-modified"]',
    );
    expect(modifiedColumns).toHaveLength(2);

    // Check line numbers and content in modified column
    expect(modifiedColumns[0].textContent).toBe('1same');
    expect(modifiedColumns[1].textContent).toBe('2+new');
  });

  it('aligns consecutive removed and added lines on the same row', () => {
    const result = makeResult(
      [
        { value: 'old\n', type: 'removed' },
        { value: 'new\n', type: 'added' },
      ],
      true,
    );

    const { container } = render(<SideBySideView lines={result.lines} />);

    const originalColumns = container.querySelectorAll(
      '[data-testid="diff-column-original"]',
    );
    const modifiedColumns = container.querySelectorAll(
      '[data-testid="diff-column-modified"]',
    );

    // Should have only 1 row with both removed and added lines aligned
    expect(originalColumns).toHaveLength(1);
    expect(modifiedColumns).toHaveLength(1);

    // Row shows removed line on left and added line on right
    expect(originalColumns[0].textContent).toBe('1-old');
    expect(modifiedColumns[0].textContent).toBe('1+new');
  });

  it('renders placeholder rows when removed/added lines are not consecutive', () => {
    const result = makeResult(
      [
        { value: 'old\n', type: 'removed' },
        { value: 'same\n', type: 'unchanged' },
        { value: 'new\n', type: 'added' },
      ],
      true,
    );

    const { container } = render(<SideBySideView lines={result.lines} />);

    const originalColumns = container.querySelectorAll(
      '[data-testid="diff-column-original"]',
    );
    const modifiedColumns = container.querySelectorAll(
      '[data-testid="diff-column-modified"]',
    );

    expect(originalColumns).toHaveLength(3);
    expect(modifiedColumns).toHaveLength(3);

    // First row: removed line with placeholder on right
    expect(originalColumns[0].textContent).toBe('1-old');
    expect(modifiedColumns[0].textContent).toBe('\u00A0');

    // Second row: unchanged line on both sides
    expect(originalColumns[1].textContent).toBe('2same');
    expect(modifiedColumns[1].textContent).toBe('1same');

    // Third row: placeholder on left with added line on right
    expect(originalColumns[2].textContent).toBe('\u00A0');
    expect(modifiedColumns[2].textContent).toBe('2+new');
  });

  it('aligns multiple consecutive removed and added lines', () => {
    const result = makeResult(
      [
        { value: 'old1\n', type: 'removed' },
        { value: 'old2\n', type: 'removed' },
        { value: 'new1\n', type: 'added' },
        { value: 'new2\n', type: 'added' },
      ],
      true,
    );

    const { container } = render(<SideBySideView lines={result.lines} />);

    const originalColumns = container.querySelectorAll(
      '[data-testid="diff-column-original"]',
    );
    const modifiedColumns = container.querySelectorAll(
      '[data-testid="diff-column-modified"]',
    );

    // Should have 2 rows: old1/new1 and old2/new2
    expect(originalColumns).toHaveLength(2);
    expect(modifiedColumns).toHaveLength(2);

    expect(originalColumns[0].textContent).toBe('1-old1');
    expect(modifiedColumns[0].textContent).toBe('1+new1');

    expect(originalColumns[1].textContent).toBe('2-old2');
    expect(modifiedColumns[1].textContent).toBe('2+new2');
  });

  it('handles more removed lines than added lines', () => {
    const result = makeResult(
      [
        { value: 'old1\n', type: 'removed' },
        { value: 'old2\n', type: 'removed' },
        { value: 'old3\n', type: 'removed' },
        { value: 'new1\n', type: 'added' },
        { value: 'new2\n', type: 'added' },
      ],
      true,
    );

    const { container } = render(<SideBySideView lines={result.lines} />);

    const originalColumns = container.querySelectorAll(
      '[data-testid="diff-column-original"]',
    );
    const modifiedColumns = container.querySelectorAll(
      '[data-testid="diff-column-modified"]',
    );

    // Should have 3 rows: old1/new1, old2/new2, old3/placeholder
    expect(originalColumns).toHaveLength(3);
    expect(modifiedColumns).toHaveLength(3);

    expect(originalColumns[0].textContent).toBe('1-old1');
    expect(modifiedColumns[0].textContent).toBe('1+new1');

    expect(originalColumns[1].textContent).toBe('2-old2');
    expect(modifiedColumns[1].textContent).toBe('2+new2');

    expect(originalColumns[2].textContent).toBe('3-old3');
    expect(modifiedColumns[2].textContent).toBe('\u00A0');
  });

  it('handles more added lines than removed lines', () => {
    const result = makeResult(
      [
        { value: 'old1\n', type: 'removed' },
        { value: 'old2\n', type: 'removed' },
        { value: 'new1\n', type: 'added' },
        { value: 'new2\n', type: 'added' },
        { value: 'new3\n', type: 'added' },
      ],
      true,
    );

    const { container } = render(<SideBySideView lines={result.lines} />);

    const originalColumns = container.querySelectorAll(
      '[data-testid="diff-column-original"]',
    );
    const modifiedColumns = container.querySelectorAll(
      '[data-testid="diff-column-modified"]',
    );

    // Should have 3 rows: old1/new1, old2/new2, placeholder/new3
    expect(originalColumns).toHaveLength(3);
    expect(modifiedColumns).toHaveLength(3);

    expect(originalColumns[0].textContent).toBe('1-old1');
    expect(modifiedColumns[0].textContent).toBe('1+new1');

    expect(originalColumns[1].textContent).toBe('2-old2');
    expect(modifiedColumns[1].textContent).toBe('2+new2');

    expect(originalColumns[2].textContent).toBe('\u00A0');
    expect(modifiedColumns[2].textContent).toBe('3+new3');
  });
});
