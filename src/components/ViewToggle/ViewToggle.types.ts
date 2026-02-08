import type { ViewMode } from 'src/types/diff';

export interface ViewToggleProps {
  /** The currently active view mode */
  activeMode: ViewMode;
  /** Callback when the user selects a different mode */
  onModeChange: (mode: ViewMode) => void;
}
