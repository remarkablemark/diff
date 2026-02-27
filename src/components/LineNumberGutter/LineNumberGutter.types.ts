/**
 * LineNumberGutter component types and interfaces
 */

export interface LineNumberGutterProps {
  /** Total number of lines to display */
  lineCount: number;
  /** Current digit width for gutter sizing */
  digitCount: 2 | 3;
  /** Current vertical scroll position (for sync) */
  scrollTop: number;
  /** Current horizontal scroll position (for sync) */
  scrollLeft: number;
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label */
  'aria-label'?: string;
}

export interface LineNumberGutterRef {
  /** Current scroll position */
  scrollTop: number;
  scrollLeft: number;
  /** Current digit count */
  digitCount: 2 | 3;
  /** Scroll to specific position */
  scrollTo: (scrollTop: number, scrollLeft?: number) => void;
}
