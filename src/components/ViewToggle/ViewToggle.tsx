import type { ViewToggleProps } from './ViewToggle.types';

export default function ViewToggle({
  activeMode,
  onModeChange,
}: ViewToggleProps) {
  return (
    <div
      className="hidden md:flex md:gap-1"
      role="group"
      aria-label="View mode"
    >
      <button
        type="button"
        onClick={() => {
          onModeChange('unified');
        }}
        className={`rounded-l-md px-3 py-1.5 text-sm font-medium transition-colors ${
          activeMode === 'unified'
            ? 'bg-blue-500 text-white dark:bg-blue-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        Unified
      </button>
      <button
        type="button"
        onClick={() => {
          onModeChange('side-by-side');
        }}
        className={`rounded-r-md px-3 py-1.5 text-sm font-medium transition-colors ${
          activeMode === 'side-by-side'
            ? 'bg-blue-500 text-white dark:bg-blue-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        Side-by-Side
      </button>
    </div>
  );
}
