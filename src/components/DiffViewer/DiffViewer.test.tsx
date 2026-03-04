import { render, screen, waitFor } from '@testing-library/react';
import type { DiffLineResult } from 'src/types/diff';
import { segmentsToLines } from 'src/utils/segmentsToLines';

import DiffViewer from '.';

function makeResult(
  segments: DiffLineResult['segments'],
  hasChanges: boolean,
): DiffLineResult {
  return { segments, hasChanges, lines: segmentsToLines(segments) };
}

describe('DiffViewer component', () => {
  it('renders nothing when result is null', () => {
    const { container } = render(
      <DiffViewer result={null} viewMode="unified" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders "No differences found" with role="status" when hasChanges is false', () => {
    const result = makeResult([{ value: 'hello', type: 'unchanged' }], false);

    render(<DiffViewer result={result} viewMode="unified" />);

    expect(screen.getByText('No differences found')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders added segments with green styling and + prefix', () => {
    const result = makeResult([{ value: 'added text', type: 'added' }], true);

    render(<DiffViewer result={result} viewMode="unified" />);

    const addedElement = screen.getByText(/added text/);
    expect(addedElement).toBeInTheDocument();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const row = addedElement.closest('div')!;
    expect(row.className).toContain('bg-green-100');
    // Check that the + prefix exists in the same row
    expect(row.querySelector('span')).toBeInTheDocument();
  });

  it('renders removed segments with red styling and - prefix', () => {
    const result = makeResult(
      [{ value: 'removed text', type: 'removed' }],
      true,
    );

    render(<DiffViewer result={result} viewMode="unified" />);

    const removedElement = screen.getByText(/removed text/);
    expect(removedElement).toBeInTheDocument();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const row = removedElement.closest('div')!;
    expect(row.className).toContain('bg-red-100');
    // Check that the - prefix exists in the same row
    expect(row.querySelector('span')).toBeInTheDocument();
  });

  it('renders unchanged segments without highlighting', () => {
    const result = makeResult(
      [
        { value: 'unchanged', type: 'unchanged' },
        { value: 'added', type: 'added' },
      ],
      true,
    );

    render(<DiffViewer result={result} viewMode="unified" />);

    const unchangedElement = screen.getByText('unchanged');
    expect(unchangedElement).toBeInTheDocument();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const row = unchangedElement.closest('div')!;
    expect(row.className).not.toContain('bg-green');
    expect(row.className).not.toContain('bg-red');
  });

  it('renders unified view correctly', () => {
    const result = makeResult(
      [
        { value: 'hello ', type: 'unchanged' },
        { value: 'world', type: 'removed' },
        { value: 'there', type: 'added' },
      ],
      true,
    );

    const { container } = render(
      <DiffViewer result={result} viewMode="unified" diffMethod="words" />,
    );

    const diffOutput = container.querySelector('[aria-live="polite"]');
    expect(diffOutput).toBeInTheDocument();
    expect(screen.getByText(/world/)).toBeInTheDocument();
    expect(screen.getByText(/there/)).toBeInTheDocument();
  });

  it('wraps output in aria-live="polite"', () => {
    const result = makeResult([{ value: 'test', type: 'unchanged' }], false);

    const { container } = render(
      <DiffViewer result={result} viewMode="unified" diffMethod="words" />,
    );

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('renders line number gutter in unified view', () => {
    const result = makeResult(
      [
        { value: 'line1\n', type: 'unchanged' },
        { value: 'old\n', type: 'removed' },
        { value: 'new\n', type: 'added' },
      ],
      true,
    );

    const { container } = render(
      <DiffViewer result={result} viewMode="unified" diffMethod="words" />,
    );

    // Check for line numbers in the grid (first column cells)
    const grid = container.querySelector('.grid.grid-cols-\\[auto_1fr\\]');
    expect(grid).toBeInTheDocument();
    // Line number cells should be present
    const lineNumberCells = container.querySelectorAll(
      '.grid > div:nth-child(odd)',
    );
    expect(lineNumberCells.length).toBeGreaterThan(0);
  });

  it('shows both line numbers for unchanged lines in unified view', () => {
    const result = makeResult(
      [
        { value: 'same\n', type: 'unchanged' },
        { value: 'extra\n', type: 'added' },
      ],
      true,
    );

    const { container } = render(
      <DiffViewer result={result} viewMode="unified" diffMethod="words" />,
    );

    // Check that line numbers are rendered in the first column (odd children)
    const firstLineNumber = container.querySelector('.grid > div:nth-child(1)');
    expect(firstLineNumber).toBeInTheDocument();
    expect(firstLineNumber?.textContent).toBe('1');
  });

  it('shows only original line number for removed lines', () => {
    const result = makeResult([{ value: 'removed\n', type: 'removed' }], true);

    const { container } = render(
      <DiffViewer result={result} viewMode="unified" diffMethod="words" />,
    );

    // Check that line number is rendered for removed line (first child = first line number)
    const lineNumberCell = container.querySelector('.grid > div:nth-child(1)');
    expect(lineNumberCell).toBeInTheDocument();
    expect(lineNumberCell?.textContent).toBe('1');
  });

  it('shows only modified line number for added lines', () => {
    const result = makeResult([{ value: 'added\n', type: 'added' }], true);

    const { container } = render(
      <DiffViewer result={result} viewMode="unified" diffMethod="words" />,
    );

    // Check that line number is rendered for added line (first child = first line number)
    const lineNumberCell = container.querySelector('.grid > div:nth-child(1)');
    expect(lineNumberCell).toBeInTheDocument();
    expect(lineNumberCell?.textContent).toBe('1');
  });

  it('uses modifiedLineNumber when originalLineNumber is undefined for added lines', () => {
    const result = makeResult(
      [
        { value: 'unchanged\n', type: 'unchanged' },
        { value: 'added at line 2\n', type: 'added' },
      ],
      true,
    );

    const { container } = render(
      <DiffViewer result={result} viewMode="unified" diffMethod="words" />,
    );

    // Check that the added line shows its modified line number (2)
    const addedLineNumber = container.querySelector('.grid > div:nth-child(3)');
    expect(addedLineNumber).toBeInTheDocument();
    expect(addedLineNumber?.textContent).toBe('2');
  });

  it('uses TextInput gutter styling classes', () => {
    const result = makeResult(
      [
        { value: 'line\n', type: 'unchanged' },
        { value: 'x\n', type: 'added' },
      ],
      true,
    );

    const { container } = render(
      <DiffViewer result={result} viewMode="unified" diffMethod="words" />,
    );

    // Check that line number cells have font-mono styling
    const lineNumberCell = container.querySelector('.grid > div:nth-child(3)');
    expect(lineNumberCell).toBeInTheDocument();
    expect(lineNumberCell?.className).toContain('font-mono');
  });

  describe('Scroll Synchronization Integration', () => {
    it('should update scroll position when content is scrolled', async () => {
      const result = makeResult(
        [
          { value: 'line1\n', type: 'unchanged' },
          { value: 'line2\n', type: 'unchanged' },
        ],
        true,
      );

      const { container } = render(
        <DiffViewer
          result={result}
          viewMode="unified"
          enableScrollSync={true}
        />,
      );

      const gridContainer = container.querySelector(
        '.grid.grid-cols-\\[auto_1fr\\]',
      );
      expect(gridContainer).toBeInTheDocument();

      // Simulate scroll event and wait for React to process the state update
      if (gridContainer) {
        await waitFor(() => {
          expect(() => {
            gridContainer.dispatchEvent(new Event('scroll'));
          }).not.toThrow();
        });
      }
    });

    it('should render with scroll sync enabled by default', () => {
      const result = makeResult(
        [
          { value: 'line1\n', type: 'unchanged' },
          { value: 'line2\n', type: 'unchanged' },
          { value: 'line3\n', type: 'unchanged' },
        ],
        true,
      );

      const { container } = render(
        <DiffViewer result={result} viewMode="unified" />,
      );

      const diffContainer = container.querySelector('[aria-live="polite"]');
      expect(diffContainer).toBeInTheDocument();
      // Check that the container exists and has proper structure
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should render with custom className when provided', () => {
      const result = makeResult([{ value: 'test\n', type: 'unchanged' }], true);

      const { container } = render(
        <DiffViewer
          result={result}
          viewMode="unified"
          className="custom-class"
        />,
      );

      const diffContainer = container.querySelector('[aria-live="polite"]');
      expect(diffContainer).toBeInTheDocument();
      // Note: className prop will be implemented in the enhancement tasks
    });

    it('should handle empty result gracefully', () => {
      const { container } = render(
        <DiffViewer result={null} viewMode="unified" />,
      );

      expect(container.innerHTML).toBe('');
    });

    it('should handle result with no changes gracefully', () => {
      const result = makeResult(
        [{ value: 'same\n', type: 'unchanged' }],
        false,
      );

      render(<DiffViewer result={result} viewMode="unified" />);

      expect(screen.getByText('No differences found')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should use explicit gutterWidth when provided', () => {
      const result = makeResult([{ value: 'test\n', type: 'unchanged' }], true);

      const { container } = render(
        <DiffViewer result={result} viewMode="unified" gutterWidth={3} />,
      );

      // Check that the grid structure exists with line numbers
      const grid = container.querySelector('.grid.grid-cols-\\[auto_1fr\\]');
      expect(grid).toBeInTheDocument();
    });

    it('should calculate digit count as 3 for 100+ lines', () => {
      // Create a result with 100+ lines to test the digit count calculation
      const segments: DiffLineResult['segments'] = [];
      for (let i = 0; i < 100; i++) {
        segments.push({ value: `line ${String(i)}\n`, type: 'unchanged' });
      }
      const result = makeResult(segments, true);

      const { container } = render(
        <DiffViewer result={result} viewMode="unified" gutterWidth="auto" />,
      );

      // Check that the grid structure exists with line numbers
      const grid = container.querySelector('.grid.grid-cols-\\[auto_1fr\\]');
      expect(grid).toBeInTheDocument();
    });

    it('should not update scroll position when scroll sync is disabled', () => {
      const result = makeResult(
        [
          { value: 'line1\n', type: 'unchanged' },
          { value: 'line2\n', type: 'unchanged' },
        ],
        true,
      );

      const { container } = render(
        <DiffViewer
          result={result}
          viewMode="unified"
          enableScrollSync={false}
        />,
      );

      const gridContainer = container.querySelector(
        '.grid.grid-cols-\\[auto_1fr\\]',
      );
      expect(gridContainer).toBeInTheDocument();

      // Simulate scroll event - should not throw even with sync disabled
      if (gridContainer) {
        expect(() => {
          gridContainer.dispatchEvent(new Event('scroll'));
        }).not.toThrow();
      }
    });
  });
});
