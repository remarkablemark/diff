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
    expect(originalColumns.length).toBe(3);

    const modifiedColumns = container.querySelectorAll(
      '[data-testid="diff-column-modified"]',
    );
    expect(modifiedColumns.length).toBe(3);
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
    expect(originalColumns.length).toBe(3);

    const modifiedColumns = container.querySelectorAll(
      '[data-testid="diff-column-modified"]',
    );
    expect(modifiedColumns.length).toBe(3);
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

  it('renders placeholder rows for missing lines in side-by-side view', () => {
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
    expect(originalColumns).toHaveLength(2);

    // First row: original side shows removed line
    expect(originalColumns[0].textContent).toBe('1-old');

    // Second row: original side should be placeholder for added line
    expect(originalColumns[1].textContent).toBe('\u00A0');
  });
});
