import type { DiffMethod } from 'src/types/diff';

export interface DiffMethodToggleProps {
  /** The currently selected diff method */
  activeMethod: DiffMethod;
  /** Callback when the user selects a different method */
  onMethodChange: (method: DiffMethod) => void;
}
