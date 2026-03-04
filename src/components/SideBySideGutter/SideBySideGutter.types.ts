/**
 * SideBySideGutter component types and interfaces
 */

import type { DiffLine } from '../../types/diff';

export interface DiffRowPair {
  original: DiffLine | null;
  modified: DiffLine | null;
}

export interface SideBySideGutterProps {
  /** Paired line data for side-by-side display */
  pairs: DiffRowPair[];
  /** Which column to display: 'original' or 'modified' */
  column: 'original' | 'modified';
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label */
  'aria-label'?: string;
}
