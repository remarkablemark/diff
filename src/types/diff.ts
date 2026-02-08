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

/** A single line in the diff output with line number metadata */
export interface DiffLine {
  /** The text content of this line (without trailing newline) */
  text: string;
  /** The diff classification: added, removed, or unchanged */
  type: DiffType;
  /** Line number in the original text, undefined for added lines */
  originalLineNumber: number | undefined;
  /** Line number in the modified text, undefined for removed lines */
  modifiedLineNumber: number | undefined;
}

/** Extended diff result with line-based output for rendering with line numbers */
export interface DiffLineResult extends DiffResult {
  /** Line-based representation of the diff, derived from segments */
  lines: DiffLine[];
}
