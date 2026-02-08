import { useId, useRef } from 'react';

import type { TextInputProps } from './TextInput.types';

export default function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: TextInputProps) {
  const id = useId();
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineCount = value ? value.split('\n').length : 1;

  const handleScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = event.currentTarget.scrollTop;
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <label
        htmlFor={id}
        className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <div className="flex max-h-64 overflow-hidden rounded-md border border-gray-300 dark:border-gray-600">
        <div
          ref={gutterRef}
          data-testid="line-gutter"
          aria-hidden="true"
          className="overflow-hidden bg-gray-50 px-2 py-2 text-right font-mono text-sm leading-6 text-gray-400 select-none dark:bg-gray-800 dark:text-gray-500"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onScroll={handleScroll}
          placeholder={placeholder}
          className="flex-1 resize-none overflow-y-auto bg-white px-3 py-2 font-mono text-sm leading-6 text-gray-900 outline-none dark:bg-gray-800 dark:text-gray-100"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
