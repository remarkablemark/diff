/** Classification of a diff segment */
export type DiffType = 'added' | 'removed' | 'unchanged';

/** A contiguous portion of text within a diff result */
export interface DiffSegment {
  /** The text content of this segment */
  value: string;
  /** The diff classification */
  type: DiffType;
}

/** The complete diff computation result */
export interface DiffResult {
  /** Ordered list of diff segments */
  segments: DiffSegment[];
  /** True if any segment is added or removed */
  hasChanges: boolean;
}

/** Available diff display modes */
export type ViewMode = 'unified' | 'side-by-side';

/** Available diff comparison methods */
export type DiffMethod = 'characters' | 'words' | 'lines';
