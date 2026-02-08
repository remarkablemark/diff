import { render, screen } from '@testing-library/react';
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
    expect(addedElement.textContent).toContain('+');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const row = addedElement.closest('div')!;
    expect(row.className).toContain('bg-green-100');
  });

  it('renders removed segments with red styling and - prefix', () => {
    const result = makeResult(
      [{ value: 'removed text', type: 'removed' }],
      true,
    );

    render(<DiffViewer result={result} viewMode="unified" />);

    const removedElement = screen.getByText(/removed text/);
    expect(removedElement).toBeInTheDocument();
    expect(removedElement.textContent).toContain('-');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const row = removedElement.closest('div')!;
    expect(row.className).toContain('bg-red-100');
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
      <DiffViewer result={result} viewMode="unified" />,
    );

    const diffOutput = container.querySelector('[aria-live="polite"]');
    expect(diffOutput).toBeInTheDocument();
    expect(screen.getByText(/world/)).toBeInTheDocument();
    expect(screen.getByText(/there/)).toBeInTheDocument();
  });

  it('renders side-by-side view correctly', () => {
    const result = makeResult(
      [
        { value: 'hello ', type: 'unchanged' },
        { value: 'world', type: 'removed' },
        { value: 'there', type: 'added' },
      ],
      true,
    );

    const { container } = render(
      <DiffViewer result={result} viewMode="side-by-side" />,
    );

    const diffOutput = container.querySelector('[aria-live="polite"]');
    expect(diffOutput).toBeInTheDocument();

    const columns = container.querySelectorAll('[data-testid^="diff-column-"]');
    expect(columns).toHaveLength(2);
  });

  it('wraps output in aria-live="polite"', () => {
    const result = makeResult([{ value: 'test', type: 'unchanged' }], false);

    const { container } = render(
      <DiffViewer result={result} viewMode="unified" />,
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
      <DiffViewer result={result} viewMode="unified" />,
    );

    const gutter = container.querySelector('[data-testid="diff-gutter"]');
    expect(gutter).toBeInTheDocument();
    expect(gutter?.getAttribute('aria-hidden')).toBe('true');
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
      <DiffViewer result={result} viewMode="unified" />,
    );

    const origCells = container.querySelectorAll(
      '[data-testid="gutter-original"]',
    );
    const modCells = container.querySelectorAll(
      '[data-testid="gutter-modified"]',
    );
    expect(origCells[0].textContent).toBe('1');
    expect(modCells[0].textContent).toBe('1');
  });

  it('shows only original line number for removed lines', () => {
    const result = makeResult([{ value: 'removed\n', type: 'removed' }], true);

    const { container } = render(
      <DiffViewer result={result} viewMode="unified" />,
    );

    const origCells = container.querySelectorAll(
      '[data-testid="gutter-original"]',
    );
    const modCells = container.querySelectorAll(
      '[data-testid="gutter-modified"]',
    );
    expect(origCells[0].textContent).toBe('1');
    expect(modCells[0].textContent).toBe('');
  });

  it('shows only modified line number for added lines', () => {
    const result = makeResult([{ value: 'added\n', type: 'added' }], true);

    const { container } = render(
      <DiffViewer result={result} viewMode="unified" />,
    );

    const origCells = container.querySelectorAll(
      '[data-testid="gutter-original"]',
    );
    const modCells = container.querySelectorAll(
      '[data-testid="gutter-modified"]',
    );
    expect(origCells[0].textContent).toBe('');
    expect(modCells[0].textContent).toBe('1');
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
      <DiffViewer result={result} viewMode="unified" />,
    );

    const gutter = container.querySelector('[data-testid="diff-gutter"]');
    expect(gutter?.className).toContain('bg-gray-50');
    expect(gutter?.className).toContain('font-mono');
    expect(gutter?.className).toContain('select-none');
  });
});
