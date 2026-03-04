import { render, screen } from '@testing-library/react';

import type { DiffLine } from '../../types/diff';
import { SideBySideGutter } from './SideBySideGutter';
import type { SideBySideGutterProps } from './SideBySideGutter.types';

describe('SideBySideGutter', () => {
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

  const defaultProps: SideBySideGutterProps = {
    pairs: [],
    column: 'original',
    'aria-label': 'Line numbers',
  };

  describe('basic rendering', () => {
    it('should render with monospace font', () => {
      render(<SideBySideGutter {...defaultProps} />);

      const gutter = screen.getByLabelText('Line numbers');
      expect(gutter).toHaveClass('font-mono');
    });

    it('should handle empty pairs array', () => {
      render(<SideBySideGutter {...defaultProps} pairs={[]} />);

      const gutter = screen.getByLabelText('Line numbers');
      expect(gutter).toBeInTheDocument();
      const lineElements = gutter.querySelectorAll('[data-testid^="sbs-"]');
      expect(lineElements).toHaveLength(0);
    });

    it('should apply custom className', () => {
      render(<SideBySideGutter {...defaultProps} className="custom-class" />);

      const gutter = screen.getByLabelText('Line numbers');
      expect(gutter).toHaveClass('custom-class');
    });

    it('should handle component unmounting gracefully', () => {
      const { unmount } = render(<SideBySideGutter {...defaultProps} />);

      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('original column', () => {
    it('should display original line numbers', () => {
      const pairs = [
        {
          original: createLine('line 1', 'unchanged', 1, 1),
          modified: createLine('line 1', 'unchanged', 1, 1),
        },
        {
          original: createLine('line 2', 'removed', 2, undefined),
          modified: null,
        },
        {
          original: null,
          modified: createLine('line 2', 'added', undefined, 2),
        },
      ];

      render(
        <SideBySideGutter {...defaultProps} pairs={pairs} column="original" />,
      );

      const gutter = screen.getByLabelText('Line numbers');
      const lines = gutter.querySelectorAll(
        '[data-testid="sbs-original-line"]',
      );

      expect(lines).toHaveLength(3);
      expect(lines[0]).toHaveTextContent('1');
      expect(lines[1]).toHaveTextContent('2');
      expect(lines[2]).toHaveTextContent('');
    });

    it('should show blank for added lines in original column', () => {
      const pairs = [
        { original: null, modified: createLine('new', 'added', undefined, 1) },
      ];

      render(
        <SideBySideGutter {...defaultProps} pairs={pairs} column="original" />,
      );

      const gutter = screen.getByLabelText('Line numbers');
      const lines = gutter.querySelectorAll(
        '[data-testid="sbs-original-line"]',
      );

      expect(lines).toHaveLength(1);
      expect(lines[0]).toHaveTextContent('');
    });
  });

  describe('modified column', () => {
    it('should display modified line numbers', () => {
      const pairs = [
        {
          original: createLine('line 1', 'unchanged', 1, 1),
          modified: createLine('line 1', 'unchanged', 1, 1),
        },
        {
          original: createLine('line 2', 'removed', 2, undefined),
          modified: null,
        },
        {
          original: null,
          modified: createLine('line 2', 'added', undefined, 2),
        },
      ];

      render(
        <SideBySideGutter {...defaultProps} pairs={pairs} column="modified" />,
      );

      const gutter = screen.getByLabelText('Line numbers');
      const lines = gutter.querySelectorAll(
        '[data-testid="sbs-modified-line"]',
      );

      expect(lines).toHaveLength(3);
      expect(lines[0]).toHaveTextContent('1');
      expect(lines[1]).toHaveTextContent('');
      expect(lines[2]).toHaveTextContent('2');
    });

    it('should show blank for removed lines in modified column', () => {
      const pairs = [
        {
          original: createLine('old', 'removed', 1, undefined),
          modified: null,
        },
      ];

      render(
        <SideBySideGutter {...defaultProps} pairs={pairs} column="modified" />,
      );

      const gutter = screen.getByLabelText('Line numbers');
      const lines = gutter.querySelectorAll(
        '[data-testid="sbs-modified-line"]',
      );

      expect(lines).toHaveLength(1);
      expect(lines[0]).toHaveTextContent('');
    });
  });

  describe('accessibility', () => {
    it('should have aria-hidden attribute', () => {
      render(<SideBySideGutter {...defaultProps} />);

      const gutter = screen.getByLabelText('Line numbers');
      expect(gutter).toHaveAttribute('aria-hidden', 'true');
    });

    it('should use custom aria-label', () => {
      render(<SideBySideGutter {...defaultProps} aria-label="Custom label" />);

      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
    });
  });
});
