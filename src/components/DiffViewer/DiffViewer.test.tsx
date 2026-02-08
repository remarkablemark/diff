import { render, screen } from '@testing-library/react';
import type { DiffResult } from 'src/types/diff';

import DiffViewer from '.';

describe('DiffViewer component', () => {
  it('renders nothing when result is null', () => {
    const { container } = render(
      <DiffViewer result={null} viewMode="unified" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders "No differences found" with role="status" when hasChanges is false', () => {
    const result: DiffResult = {
      segments: [{ value: 'hello', type: 'unchanged' }],
      hasChanges: false,
    };

    render(<DiffViewer result={result} viewMode="unified" />);

    expect(screen.getByText('No differences found')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders added segments with green styling and + prefix', () => {
    const result: DiffResult = {
      segments: [{ value: 'added text', type: 'added' }],
      hasChanges: true,
    };

    render(<DiffViewer result={result} viewMode="unified" />);

    const addedElement = screen.getByText(/added text/);
    expect(addedElement).toBeInTheDocument();
    expect(addedElement.textContent).toContain('+');
    expect(addedElement.className).toContain('bg-green-100');
  });

  it('renders removed segments with red styling and - prefix', () => {
    const result: DiffResult = {
      segments: [{ value: 'removed text', type: 'removed' }],
      hasChanges: true,
    };

    render(<DiffViewer result={result} viewMode="unified" />);

    const removedElement = screen.getByText(/removed text/);
    expect(removedElement).toBeInTheDocument();
    expect(removedElement.textContent).toContain('-');
    expect(removedElement.className).toContain('bg-red-100');
  });

  it('renders unchanged segments without highlighting', () => {
    const result: DiffResult = {
      segments: [
        { value: 'unchanged', type: 'unchanged' },
        { value: 'added', type: 'added' },
      ],
      hasChanges: true,
    };

    render(<DiffViewer result={result} viewMode="unified" />);

    const unchangedElement = screen.getByText('unchanged');
    expect(unchangedElement).toBeInTheDocument();
    expect(unchangedElement.className).not.toContain('bg-green');
    expect(unchangedElement.className).not.toContain('bg-red');
  });

  it('renders unified view correctly', () => {
    const result: DiffResult = {
      segments: [
        { value: 'hello ', type: 'unchanged' },
        { value: 'world', type: 'removed' },
        { value: 'there', type: 'added' },
      ],
      hasChanges: true,
    };

    const { container } = render(
      <DiffViewer result={result} viewMode="unified" />,
    );

    const diffOutput = container.querySelector('[aria-live="polite"]');
    expect(diffOutput).toBeInTheDocument();
    expect(screen.getByText(/world/)).toBeInTheDocument();
    expect(screen.getByText(/there/)).toBeInTheDocument();
  });

  it('renders side-by-side view correctly', () => {
    const result: DiffResult = {
      segments: [
        { value: 'hello ', type: 'unchanged' },
        { value: 'world', type: 'removed' },
        { value: 'there', type: 'added' },
      ],
      hasChanges: true,
    };

    const { container } = render(
      <DiffViewer result={result} viewMode="side-by-side" />,
    );

    const diffOutput = container.querySelector('[aria-live="polite"]');
    expect(diffOutput).toBeInTheDocument();

    const columns = container.querySelectorAll('[data-testid^="diff-column-"]');
    expect(columns).toHaveLength(2);
  });

  it('wraps output in aria-live="polite"', () => {
    const result: DiffResult = {
      segments: [{ value: 'test', type: 'unchanged' }],
      hasChanges: false,
    };

    const { container } = render(
      <DiffViewer result={result} viewMode="unified" />,
    );

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });
});
