import { render, screen } from '@testing-library/react';

import type { DiffLine } from '../../types/diff';
import { LineNumberGutter } from './LineNumberGutter';
import type { LineNumberGutterProps } from './LineNumberGutter.types';

describe('LineNumberGutter', () => {
  const createLine = (
    text: string,
    type: DiffLine['type'],
    originalNum?: number,
    modifiedNum?: number,
  ): DiffLine => ({
    text,
    type,
    originalLineNumber: originalNum,
    modifiedLineNumber: modifiedNum,
  });

  const defaultProps: LineNumberGutterProps = {
    lines: [],
    viewMode: 'unified',
    scrollTop: 0,
    'aria-label': 'Line numbers',
  };

  describe('basic rendering', () => {
    it('should render with monospace font and right alignment', () => {
      render(<LineNumberGutter {...defaultProps} />);

      const gutter = screen.getByLabelText('Line numbers');
      expect(gutter).toHaveClass('font-mono', 'text-right');
    });

    it('should handle scroll events', () => {
      render(<LineNumberGutter {...defaultProps} />);

      const gutter = screen.getByLabelText('Line numbers');
      gutter.dispatchEvent(new Event('scroll'));
      expect(gutter).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<LineNumberGutter {...defaultProps} className="custom-class" />);

      const gutter = screen.getByLabelText('Line numbers');
      expect(gutter).toHaveClass('custom-class');
    });

    it('should handle empty lines array', () => {
      render(<LineNumberGutter {...defaultProps} lines={[]} />);

      const gutter = screen.getByLabelText('Line numbers');
      expect(gutter).toBeInTheDocument();
      const lineElements = screen.queryAllByText(/^\d+$/);
      expect(lineElements).toHaveLength(0);
    });

    it('should update scroll position when scrollTop props change', () => {
      const { rerender } = render(
        <LineNumberGutter {...defaultProps} scrollTop={0} />,
      );

      const gutter = screen.getByLabelText('Line numbers');
      expect(gutter).toBeInTheDocument();

      rerender(<LineNumberGutter {...defaultProps} scrollTop={100} />);

      expect(gutter).toBeInTheDocument();
    });

    it('should handle scroll position updates when ref is null', () => {
      const { rerender } = render(
        <LineNumberGutter {...defaultProps} scrollTop={0} />,
      );

      expect(() => {
        rerender(<LineNumberGutter {...defaultProps} scrollTop={100} />);
      }).not.toThrow();
    });

    it('should handle component unmounting gracefully', () => {
      const { unmount } = render(
        <LineNumberGutter {...defaultProps} scrollTop={0} />,
      );

      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('should handle scroll position changes without throwing errors', () => {
      const { rerender } = render(
        <LineNumberGutter {...defaultProps} scrollTop={10} />,
      );

      expect(() => {
        rerender(<LineNumberGutter {...defaultProps} scrollTop={20} />);
        rerender(<LineNumberGutter {...defaultProps} scrollTop={0} />);
      }).not.toThrow();
    });

    it('should handle horizontal scrollbar detection on scroll', () => {
      const { rerender } = render(<LineNumberGutter {...defaultProps} />);

      const gutter = screen.getByLabelText('Line numbers');
      expect(gutter).toBeInTheDocument();

      expect(() => {
        rerender(<LineNumberGutter {...defaultProps} />);
      }).not.toThrow();
    });
  });

  describe('User Story 1: Unified view dual-column line numbers', () => {
    it('T004: removed line shows original number, blank modified', () => {
      const lines: DiffLine[] = [
        createLine('original line', 'removed', 1, undefined),
      ];

      render(
        <LineNumberGutter {...defaultProps} lines={lines} viewMode="unified" />,
      );

      // Should show original line number in left column
      const originalNum = screen.getByText('1');
      expect(originalNum).toBeInTheDocument();

      // Modified column should be empty (no number displayed for removed line)
      const gutter = screen.getByLabelText('Line numbers');
      const cells = gutter.querySelectorAll('.grid-cols-2 span');
      expect(cells).toHaveLength(2);
      expect(cells[0]).toHaveTextContent('1');
      expect(cells[1]).toHaveTextContent('');
    });

    it('T005: added line shows blank original, modified number', () => {
      const lines: DiffLine[] = [createLine('new line', 'added', undefined, 1)];

      render(
        <LineNumberGutter {...defaultProps} lines={lines} viewMode="unified" />,
      );

      const gutter = screen.getByLabelText('Line numbers');
      const cells = gutter.querySelectorAll('.grid-cols-2 span');
      expect(cells).toHaveLength(2);
      expect(cells[0]).toHaveTextContent('');
      expect(cells[1]).toHaveTextContent('1');
    });

    it('T006: unchanged line shows both numbers side-by-side', () => {
      const lines: DiffLine[] = [createLine('same line', 'unchanged', 1, 1)];

      render(
        <LineNumberGutter {...defaultProps} lines={lines} viewMode="unified" />,
      );

      const gutter = screen.getByLabelText('Line numbers');
      const cells = gutter.querySelectorAll('.grid-cols-2 span');
      expect(cells).toHaveLength(2);
      expect(cells[0]).toHaveTextContent('1');
      expect(cells[1]).toHaveTextContent('1');
    });

    it('T007: line numbers offset correctly after lines added at beginning', () => {
      const lines: DiffLine[] = [
        createLine('added 1', 'added', undefined, 1),
        createLine('added 2', 'added', undefined, 2),
        createLine('original 1', 'unchanged', 1, 3),
        createLine('original 2', 'unchanged', 2, 4),
      ];

      render(
        <LineNumberGutter {...defaultProps} lines={lines} viewMode="unified" />,
      );

      const gutter = screen.getByLabelText('Line numbers');
      const cells = gutter.querySelectorAll('.grid-cols-2 span');

      // First two rows: added lines (blank original, modified 1 and 2)
      expect(cells[0]).toHaveTextContent('');
      expect(cells[1]).toHaveTextContent('1');
      expect(cells[2]).toHaveTextContent('');
      expect(cells[3]).toHaveTextContent('2');

      // Next two rows: unchanged lines with offset (original 1,2 | modified 3,4)
      expect(cells[4]).toHaveTextContent('1');
      expect(cells[5]).toHaveTextContent('3');
      expect(cells[6]).toHaveTextContent('2');
      expect(cells[7]).toHaveTextContent('4');
    });

    it('T008: line numbers offset correctly after lines removed from middle', () => {
      const lines: DiffLine[] = [
        createLine('original 1', 'unchanged', 1, 1),
        createLine('original 2', 'unchanged', 2, 2),
        createLine('removed 1', 'removed', 3, undefined),
        createLine('removed 2', 'removed', 4, undefined),
        createLine('original 3', 'unchanged', 5, 3),
      ];

      render(
        <LineNumberGutter {...defaultProps} lines={lines} viewMode="unified" />,
      );

      const gutter = screen.getByLabelText('Line numbers');
      const cells = gutter.querySelectorAll('.grid-cols-2 span');

      // First two rows: unchanged (1,1 | 2,2)
      expect(cells[0]).toHaveTextContent('1');
      expect(cells[1]).toHaveTextContent('1');
      expect(cells[2]).toHaveTextContent('2');
      expect(cells[3]).toHaveTextContent('2');

      // Next two rows: removed (3,blank | 4,blank)
      expect(cells[4]).toHaveTextContent('3');
      expect(cells[5]).toHaveTextContent('');
      expect(cells[6]).toHaveTextContent('4');
      expect(cells[7]).toHaveTextContent('');

      // Last row: unchanged with offset (5,3)
      expect(cells[8]).toHaveTextContent('5');
      expect(cells[9]).toHaveTextContent('3');
    });

    it('T008b: empty text edge case (one text empty)', () => {
      // All lines are "added" when original is empty
      const lines: DiffLine[] = [
        createLine('line 1', 'added', undefined, 1),
        createLine('line 2', 'added', undefined, 2),
      ];

      render(
        <LineNumberGutter {...defaultProps} lines={lines} viewMode="unified" />,
      );

      const gutter = screen.getByLabelText('Line numbers');
      const cells = gutter.querySelectorAll('.grid-cols-2 span');

      expect(cells[0]).toHaveTextContent('');
      expect(cells[1]).toHaveTextContent('1');
      expect(cells[2]).toHaveTextContent('');
      expect(cells[3]).toHaveTextContent('2');
    });

    it('T008c: consecutive added/removed lines edge case', () => {
      const lines: DiffLine[] = [
        createLine('removed 1', 'removed', 1, undefined),
        createLine('removed 2', 'removed', 2, undefined),
        createLine('removed 3', 'removed', 3, undefined),
        createLine('added 1', 'added', undefined, 1),
        createLine('added 2', 'added', undefined, 2),
      ];

      render(
        <LineNumberGutter {...defaultProps} lines={lines} viewMode="unified" />,
      );

      const gutter = screen.getByLabelText('Line numbers');
      const cells = gutter.querySelectorAll('.grid-cols-2 span');

      // Removed lines: original numbers, blank modified
      expect(cells[0]).toHaveTextContent('1');
      expect(cells[1]).toHaveTextContent('');
      expect(cells[2]).toHaveTextContent('2');
      expect(cells[3]).toHaveTextContent('');
      expect(cells[4]).toHaveTextContent('3');
      expect(cells[5]).toHaveTextContent('');

      // Added lines: blank original, modified numbers
      expect(cells[6]).toHaveTextContent('');
      expect(cells[7]).toHaveTextContent('1');
      expect(cells[8]).toHaveTextContent('');
      expect(cells[9]).toHaveTextContent('2');
    });

    it('should render multiple lines with correct dual-column layout', () => {
      const lines: DiffLine[] = [
        createLine('unchanged', 'unchanged', 1, 1),
        createLine('removed', 'removed', 2, undefined),
        createLine('added', 'added', undefined, 2),
        createLine('unchanged 2', 'unchanged', 3, 3),
      ];

      render(
        <LineNumberGutter {...defaultProps} lines={lines} viewMode="unified" />,
      );

      const gutter = screen.getByLabelText('Line numbers');
      const cells = gutter.querySelectorAll('.grid-cols-2 span');

      expect(cells).toHaveLength(8); // 4 lines × 2 columns

      // Row 1: 1 | 1
      expect(cells[0]).toHaveTextContent('1');
      expect(cells[1]).toHaveTextContent('1');
      // Row 2: 2 | (blank)
      expect(cells[2]).toHaveTextContent('2');
      expect(cells[3]).toHaveTextContent('');
      // Row 3: (blank) | 2
      expect(cells[4]).toHaveTextContent('');
      expect(cells[5]).toHaveTextContent('2');
      // Row 4: 3 | 3
      expect(cells[6]).toHaveTextContent('3');
      expect(cells[7]).toHaveTextContent('3');
    });
  });
});
