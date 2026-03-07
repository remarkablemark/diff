import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { useScrollPosition } from '../../hooks/useScrollPosition';
import { ScrollToTop } from './ScrollToTop';

// Mock the useScrollPosition hook
vi.mock('../../hooks/useScrollPosition', () => ({
  useScrollPosition: vi.fn(),
}));

describe('ScrollToTop', () => {
  const mockUseScrollPosition = vi.mocked(useScrollPosition);

  const originalScrollTo = window.scrollTo;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();

    // Mock matchMedia for prefers-reduced-motion
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
    window.matchMedia = originalMatchMedia;
  });

  describe('visibility based on scroll position', () => {
    it('is hidden when at top of page (not scrolled past threshold)', () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 0,
        isScrolledPastThreshold: false,
      });

      render(<ScrollToTop />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('is visible when scrolled past threshold', () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('responsive visibility', () => {
    it('is hidden on screens below XL breakpoint (< 1280px)', () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const button = screen.getByRole('button');
      // The button has 'hidden xl:block' classes, so it should be hidden by default
      expect(button).toHaveClass('hidden');
    });
  });

  describe('click behavior', () => {
    it('scrolls to top when clicked', async () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'smooth',
        });
      });
    });

    it('respects reduced motion preference when scrolling', async () => {
      // Override the beforeEach mock to return prefers-reduced-motion: reduce
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'auto',
        });
      });

      expect(window.matchMedia).toHaveBeenCalledWith(
        '(prefers-reduced-motion: reduce)',
      );
    });
  });

  describe('accessibility', () => {
    it('has ARIA label "Scroll to top"', () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const button = screen.getByRole('button', { name: 'Scroll to top' });
      expect(button).toHaveAttribute('aria-label', 'Scroll to top');
    });

    it('is keyboard accessible with Enter key', async () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'smooth',
        });
      });
    });

    it('is keyboard accessible with Space key', async () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });

      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'smooth',
        });
      });
    });

    it('prevents default behavior on Space key press', () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const button = screen.getByRole('button');
      const event = fireEvent.keyDown(button, {
        key: ' ',
        code: 'Space',
        cancelable: true,
      });

      expect(event).toBe(false); // Event was prevented
    });

    it('has focus ring for visibility', () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
    });

    it('has proper button type', () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('positioning and styling', () => {
    it('has fixed positioning at bottom-right', () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('fixed', 'bottom-4', 'right-4');
    });

    it('is circular with correct dimensions', () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-full', 'h-12', 'w-12');
    });

    it('has hover states', () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-gray-300', 'cursor-pointer');
    });

    it('supports dark mode', () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('dark:bg-gray-700', 'dark:hover:bg-gray-600');
    });

    it('displays upward arrow icon', () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('▲');
    });
  });

  describe('user interactions', () => {
    it('can be clicked using user-event', async () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const user = userEvent.setup();
      const button = screen.getByRole('button');

      await user.click(button);

      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'smooth',
        });
      });
    });

    it('can be activated with keyboard using user-event', async () => {
      mockUseScrollPosition.mockReturnValue({
        scrollY: 500,
        isScrolledPastThreshold: true,
      });

      render(<ScrollToTop />);

      const user = userEvent.setup();
      screen.getByRole('button');

      await user.tab(); // Focus the button
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'smooth',
        });
      });
    });
  });
});
