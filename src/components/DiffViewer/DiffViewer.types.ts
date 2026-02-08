import type { DiffResult, ViewMode } from 'src/types/diff';

export interface DiffViewerProps {
  /** The computed diff result, null when output should be hidden */
  result: DiffResult | null;
  /** The effective display mode (forced 'unified' on mobile) */
  viewMode: ViewMode;
}
