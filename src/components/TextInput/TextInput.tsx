import { useEffect, useId, useRef, useState } from 'react';

import type { TextInputProps } from './TextInput.types';

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: TextInputProps) {
  const id = useId();
  const gutterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasHorizontalScrollbar, setHasHorizontalScrollbar] = useState(false);

  const lineCount = value ? value.split('\n').length : 1;

  // Check for horizontal scrollbar
  const checkHorizontalScrollbar = () => {
    /* v8 ignore start */
    if (textareaRef.current) {
      const hasScrollbar =
        textareaRef.current.scrollWidth > textareaRef.current.clientWidth;
      setHasHorizontalScrollbar(hasScrollbar);
    }
    /* v8 ignore stop */
  };

  // Check scrollbar on mount and when value changes
  useEffect(() => {
    checkHorizontalScrollbar();
  }, [value]);

  const handleScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
    /* v8 ignore start */
    if (gutterRef.current) {
      gutterRef.current.scrollTop = event.currentTarget.scrollTop;
    }
    /* v8 ignore stop */
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
          className={`overflow-hidden bg-gray-50 px-2 py-2 text-right font-mono text-sm leading-6 text-gray-400 select-none dark:bg-gray-800 dark:text-gray-500 ${
            /* v8 ignore start */
            hasHorizontalScrollbar
              ? 'pb-[calc(2rem+var(--scrollbar-size,0px))]'
              : ''
            /* v8 ignore stop */
          }`}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onScroll={handleScroll}
          placeholder={placeholder}
          className="min-h-32 flex-1 resize-none overflow-x-auto overflow-y-auto px-3 py-2 font-mono text-sm leading-6 whitespace-pre text-gray-900 outline-none dark:bg-gray-800 dark:text-gray-100"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
