export interface TextInputProps {
  /** Accessible label for the textarea */
  label: string;
  /** Current text value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
}
