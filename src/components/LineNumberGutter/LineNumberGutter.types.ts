/**
 * LineNumberGutter component types and interfaces
 */

import type { DiffLine } from '../../types/diff';
import type { ViewMode } from '../../types/diff';

export interface LineNumberGutterProps {
  /** Line data with metadata for dual-column display */
  lines: DiffLine[];
  /** View context for rendering mode */
  viewMode?: ViewMode;
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
  /** Scroll to specific position */
  scrollTo: (scrollTop: number, scrollLeft?: number) => void;
}
