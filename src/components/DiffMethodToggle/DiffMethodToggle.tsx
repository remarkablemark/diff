import type { DiffMethodToggleProps } from './DiffMethodToggle.types';

export default function DiffMethodToggle({
  activeMethod,
  onMethodChange,
}: DiffMethodToggleProps) {
  return (
    <div className="flex gap-1" role="group" aria-label="Diff method">
      <button
        type="button"
        onClick={() => {
          onMethodChange('characters');
        }}
        className={`rounded-l-md px-3 py-1.5 text-sm font-medium transition-colors ${
          activeMethod === 'characters'
            ? 'bg-blue-500 text-white dark:bg-blue-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        Characters
      </button>
      <button
        type="button"
        onClick={() => {
          onMethodChange('words');
        }}
        className={`px-3 py-1.5 text-sm font-medium transition-colors ${
          activeMethod === 'words'
            ? 'bg-blue-500 text-white dark:bg-blue-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        Words
      </button>
      <button
        type="button"
        onClick={() => {
          onMethodChange('lines');
        }}
        className={`rounded-r-md px-3 py-1.5 text-sm font-medium transition-colors ${
          activeMethod === 'lines'
            ? 'bg-blue-500 text-white dark:bg-blue-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        Lines
      </button>
    </div>
  );
}
