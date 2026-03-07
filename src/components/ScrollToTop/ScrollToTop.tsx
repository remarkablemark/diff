import { useScrollPosition } from '../../hooks/useScrollPosition';

export function ScrollToTop() {
  const { isScrolledPastThreshold } = useScrollPosition({ threshold: '50vh' });

  const handleClick = () => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    /* v8 ignore start */
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
    /* v8 ignore end */
  };

  // Button only visible on screens >= 1280px (XL breakpoint)
  // Hidden by default, shown at XL breakpoint when scrolled past threshold
  if (!isScrolledPastThreshold) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label="Scroll to top"
      className="fixed right-4 bottom-4 hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-700 transition-colors hover:bg-gray-300 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none xl:block dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-offset-gray-900"
    >
      ▲
    </button>
  );
}
