import type { DiffLineResult, ViewMode } from 'src/types/diff';

export interface DiffViewerProps {
  /** The computed diff result with line data, null when output should be hidden */
  result: DiffLineResult | null;
  /** The effective display mode (forced 'unified' on mobile) */
  viewMode: ViewMode;
  /** Enable scroll synchronization (default: true) */
  enableScrollSync?: boolean;
  /** Explicit gutter width control */
  gutterWidth?: 'auto' | 2 | 3;
  /** Additional CSS classes */
  className?: string;
}

export interface DiffViewerRef {
  /** Current scroll state */
  scrollState: {
    scrollTop: number;
    scrollLeft: number;
  };
  /** Scroll to specific position */
  scrollTo: (scrollTop: number, scrollLeft?: number) => void;
  /** Get current gutter width */
  getGutterWidth: () => number;
}
