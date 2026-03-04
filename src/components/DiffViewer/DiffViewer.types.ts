import type { DiffLineResult, ViewMode } from 'src/types/diff';

export interface DiffViewerProps {
  /** The computed diff result with line data, null when output should be hidden */
  result: DiffLineResult | null;
  /** The effective display mode (forced 'unified' on mobile) */
  viewMode: ViewMode;
}
