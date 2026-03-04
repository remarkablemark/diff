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

    const columns = container.querySelectorAll('[data-testid^="diff-column-"]');
    expect(columns).toHaveLength(2);
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

    // Check for flex rows in both columns
    const origColumn = container.querySelector(
      '[data-testid="diff-column-original"]',
    );
    const modColumn = container.querySelector(
      '[data-testid="diff-column-modified"]',
    );
    expect(origColumn).toBeInTheDocument();
    expect(modColumn).toBeInTheDocument();
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

    // Line numbers are in flex rows
    const origColumn = container.querySelector(
      '[data-testid="diff-column-original"]',
    );
    const rows = origColumn?.querySelectorAll('.flex');
    expect(rows).toHaveLength(2);
    expect(rows?.[0].textContent).toBe('1same');
    expect(rows?.[1].textContent).toBe('2-old');
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

    // Line numbers are in flex rows
    const modColumn = container.querySelector(
      '[data-testid="diff-column-modified"]',
    );
    const rows = modColumn?.querySelectorAll('.flex');
    expect(rows).toHaveLength(2);
    expect(rows?.[0].textContent).toBe('1same');
    expect(rows?.[1].textContent).toBe('2+new');
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

    // Check for placeholder content in original column for added line
    const origColumn = container.querySelector(
      '[data-testid="diff-column-original"]',
    );
    const rows = origColumn?.querySelectorAll('.flex');
    expect(rows).toHaveLength(2);
    // Second row should be placeholder for added line
    expect(rows?.[1].textContent).toBe('\u00A0');
  });
});
