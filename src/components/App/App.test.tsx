import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '.';

function createMockMatchMedia(matches: boolean) {
  const listeners: (() => void)[] = [];

  const mediaQueryList = {
    matches,
    media: '',
    addEventListener: vi.fn((_event: string, handler: () => void) => {
      listeners.push(handler);
    }),
    removeEventListener: vi.fn(),
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };

  return {
    mockMatchMedia: vi.fn().mockReturnValue(mediaQueryList),
    mediaQueryList,
    triggerChange: (newMatches: boolean) => {
      mediaQueryList.matches = newMatches;
      for (const listener of listeners) {
        listener();
      }
    },
  };
}

describe('App component', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    const { mockMatchMedia } = createMockMatchMedia(false);
    window.matchMedia = mockMatchMedia;
    localStorage.clear();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('renders heading', () => {
    render(<App />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Diff');
  });

  it('renders two text inputs with correct labels', () => {
    render(<App />);

    expect(screen.getByLabelText('Original Text')).toBeInTheDocument();
    expect(screen.getByLabelText('Modified Text')).toBeInTheDocument();
  });

  it('hides diff output when both inputs are empty', () => {
    render(<App />);

    expect(screen.queryByText('No differences found')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('hides diff output when only original has text', async () => {
    const user = userEvent.setup();
    render(<App />);

    const original = screen.getByLabelText('Original Text');
    await user.type(original, 'hello');

    expect(screen.queryByText('No differences found')).not.toBeInTheDocument();
  });

  it('hides diff output when only modified has text', async () => {
    const user = userEvent.setup();
    render(<App />);

    const modified = screen.getByLabelText('Modified Text');
    await user.type(modified, 'hello');

    expect(screen.queryByText('No differences found')).not.toBeInTheDocument();
  });

  it('shows "No differences found" when texts are identical', async () => {
    const user = userEvent.setup();
    render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'hello');

    expect(screen.getByText('No differences found')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders diff method toggle when diff output is visible', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.queryByRole('group', { name: 'Diff method' }),
    ).not.toBeInTheDocument();

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'hello');

    expect(
      screen.getByRole('group', { name: 'Diff method' }),
    ).toBeInTheDocument();
  });

  it('shows diff segments when texts differ', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello world');
    await user.type(modified, 'hello there');

    expect(screen.queryByText('No differences found')).not.toBeInTheDocument();

    const diffOutput = container.querySelector('[aria-live="polite"]');
    expect(diffOutput).toBeInTheDocument();
  });

  it('renders view toggle when diff is visible on desktop', async () => {
    const { mockMatchMedia } = createMockMatchMedia(true);
    window.matchMedia = mockMatchMedia;

    const user = userEvent.setup();
    render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello world');
    await user.type(modified, 'hello there');

    expect(
      screen.getByRole('button', { name: /unified/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /side-by-side/i }),
    ).toBeInTheDocument();
  });

  it('switches view mode when toggle is clicked', async () => {
    const { mockMatchMedia } = createMockMatchMedia(true);
    window.matchMedia = mockMatchMedia;

    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello world');
    await user.type(modified, 'hello there');

    const sideBySideButton = screen.getByRole('button', {
      name: /side-by-side/i,
    });
    await user.click(sideBySideButton);

    const columns = container.querySelectorAll('[data-testid^="diff-column-"]');
    expect(columns).toHaveLength(2);
  });

  it('forces unified view on mobile regardless of toggle state', async () => {
    const { mockMatchMedia } = createMockMatchMedia(false);
    window.matchMedia = mockMatchMedia;

    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello world');
    await user.type(modified, 'hello there');

    const columns = container.querySelectorAll('[data-testid^="diff-column-"]');
    expect(columns).toHaveLength(0);
  });

  it('renders color-coded diff segments with correct classes', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello world');
    await user.type(modified, 'hello there');

    const diffOutput = container.querySelector('[aria-live="polite"]');
    const addedSpan = diffOutput?.querySelector('.bg-green-100');
    expect(addedSpan).toBeInTheDocument();
    expect(addedSpan?.textContent).toContain('there');

    const removedSpan = diffOutput?.querySelector('.bg-red-100');
    expect(removedSpan).toBeInTheDocument();
    expect(removedSpan?.textContent).toContain('world');
  });

  it('updates diff on each keystroke in original textarea', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(modified, 'abc');
    await user.type(original, 'a');

    const diffOutput = container.querySelector('[aria-live="polite"]');
    expect(diffOutput).toBeInTheDocument();

    await user.type(original, 'bc');

    expect(screen.getByText('No differences found')).toBeInTheDocument();
  });

  it('updates diff on each keystroke in modified textarea', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'abc');
    await user.type(modified, 'a');

    const diffOutput = container.querySelector('[aria-live="polite"]');
    expect(diffOutput).toBeInTheDocument();

    await user.type(modified, 'bc');

    expect(screen.getByText('No differences found')).toBeInTheDocument();
  });

  it('transitions from hidden to visible as user types in second textarea', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');

    expect(
      container.querySelector('[aria-live="polite"]'),
    ).not.toBeInTheDocument();

    await user.type(modified, 'hi');

    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
  });

  it('transitions to "No differences found" when user makes texts identical', async () => {
    const user = userEvent.setup();
    render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'world');

    expect(screen.queryByText('No differences found')).not.toBeInTheDocument();

    await user.clear(modified);
    await user.type(modified, 'hello');

    expect(screen.getByText('No differences found')).toBeInTheDocument();
  });

  it('updates output when clearing one input after diff is displayed', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'world');

    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();

    await user.clear(original);

    expect(
      container.querySelector('[aria-live="polite"]'),
    ).not.toBeInTheDocument();
  });

  it('handles special characters and emoji correctly', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'café ☕');
    await user.type(modified, 'café 🍵');

    const diffOutput = container.querySelector('[aria-live="polite"]');
    expect(diffOutput).toBeInTheDocument();

    const addedSpan = diffOutput?.querySelector('.bg-green-100');
    expect(addedSpan).toBeInTheDocument();
  });

  it('defaults to Words diff method', async () => {
    const user = userEvent.setup();
    render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'world');

    const wordsButton = screen.getByRole('button', { name: 'Words' });
    expect(wordsButton.className).toContain('bg-blue-500');
  });

  it('switches diff output when changing diff method', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'abc');
    await user.type(modified, 'aXc');

    const diffOutput = container.querySelector('[aria-live="polite"]');

    await user.click(screen.getByRole('button', { name: 'Characters' }));

    const removedSpan = diffOutput?.querySelector('.bg-red-100');
    expect(removedSpan).toBeInTheDocument();
    expect(removedSpan?.textContent).toBe('-b');

    const addedSpan = diffOutput?.querySelector('.bg-green-100');
    expect(addedSpan).toBeInTheDocument();
    expect(addedSpan?.textContent).toBe('+X');
  });

  it('persists diff method to localStorage', async () => {
    const user = userEvent.setup();
    render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'world');

    await user.click(screen.getByRole('button', { name: 'Lines' }));

    expect(localStorage.getItem('diffMethod')).toBe(JSON.stringify('lines'));
  });

  it('restores diff method from localStorage on mount', async () => {
    localStorage.setItem('diffMethod', JSON.stringify('characters'));

    const user = userEvent.setup();
    render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'world');

    const charsButton = screen.getByRole('button', { name: 'Characters' });
    expect(charsButton.className).toContain('bg-blue-500');
  });

  it('persists view mode to localStorage', async () => {
    const { mockMatchMedia } = createMockMatchMedia(true);
    window.matchMedia = mockMatchMedia;

    const user = userEvent.setup();
    render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'world');

    await user.click(screen.getByRole('button', { name: /side-by-side/i }));

    expect(localStorage.getItem('viewMode')).toBe(
      JSON.stringify('side-by-side'),
    );
  });

  it('restores view mode from localStorage on mount', async () => {
    const { mockMatchMedia } = createMockMatchMedia(true);
    window.matchMedia = mockMatchMedia;
    localStorage.setItem('viewMode', JSON.stringify('side-by-side'));

    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'world');

    const columns = container.querySelectorAll('[data-testid^="diff-column-"]');
    expect(columns).toHaveLength(2);
  });

  it('shows line number gutter in unified diff view', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'line1\nline2');
    await user.type(modified, 'line1\nchanged');

    const gutter = container.querySelector('[data-testid="diff-gutter"]');
    expect(gutter).toBeInTheDocument();
    expect(gutter?.getAttribute('aria-hidden')).toBe('true');
  });

  it('displays correct line numbers for multi-line diff', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'a\nb\n');
    await user.type(modified, 'a\nc\n');

    await user.click(screen.getByRole('button', { name: 'Lines' }));

    const origCells = container.querySelectorAll(
      '[data-testid="gutter-original"]',
    );
    const modCells = container.querySelectorAll(
      '[data-testid="gutter-modified"]',
    );
    expect(origCells.length).toBeGreaterThan(0);
    expect(modCells.length).toBeGreaterThan(0);
  });

  it('updates output when clearing one input after diff is displayed', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'world');

    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();

    await user.clear(original);

    expect(
      container.querySelector('[aria-live="polite"]'),
    ).not.toBeInTheDocument();
  });

  it('handles special characters and emoji correctly', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'café ☕');
    await user.type(modified, 'café 🍵');

    const diffOutput = container.querySelector('[aria-live="polite"]');
    expect(diffOutput).toBeInTheDocument();

    const addedSpan = diffOutput?.querySelector('.bg-green-100');
    expect(addedSpan).toBeInTheDocument();
  });

  it('defaults to Words diff method', async () => {
    const user = userEvent.setup();
    render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'world');

    const wordsButton = screen.getByRole('button', { name: 'Words' });
    expect(wordsButton.className).toContain('bg-blue-500');
  });

  it('switches diff output when changing diff method', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'abc');
    await user.type(modified, 'aXc');

    const diffOutput = container.querySelector('[aria-live="polite"]');

    await user.click(screen.getByRole('button', { name: 'Characters' }));

    const removedSpan = diffOutput?.querySelector('.bg-red-100');
    expect(removedSpan).toBeInTheDocument();
    expect(removedSpan?.textContent).toBe('-b');

    const addedSpan = diffOutput?.querySelector('.bg-green-100');
    expect(addedSpan).toBeInTheDocument();
    expect(addedSpan?.textContent).toBe('+X');
  });

  it('persists diff method to localStorage', async () => {
    const user = userEvent.setup();
    render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'world');

    await user.click(screen.getByRole('button', { name: 'Lines' }));

    expect(localStorage.getItem('diffMethod')).toBe(JSON.stringify('lines'));
  });

  it('restores diff method from localStorage on mount', async () => {
    localStorage.setItem('diffMethod', JSON.stringify('characters'));

    const user = userEvent.setup();
    render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'world');

    const charsButton = screen.getByRole('button', { name: 'Characters' });
    expect(charsButton.className).toContain('bg-blue-500');
  });

  it('persists view mode to localStorage', async () => {
    const user = userEvent.setup();
    render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'world');

    await user.click(screen.getByRole('button', { name: /side-by-side/i }));

    expect(localStorage.getItem('viewMode')).toBe(
      JSON.stringify('side-by-side'),
    );
  });

  it('restores view mode from localStorage on mount', async () => {
    localStorage.setItem('viewMode', JSON.stringify('side-by-side'));

    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }) as unknown as typeof window.matchMedia;

    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'world');

    const columns = container.querySelectorAll('[data-testid^="diff-column-"]');
    expect(columns).toHaveLength(2);
  });

  it('shows line number gutter in unified diff view', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'line1\nline2');
    await user.type(modified, 'line1\nchanged');

    const gutter = container.querySelector('[data-testid="diff-gutter"]');
    expect(gutter).toBeInTheDocument();
    expect(gutter?.getAttribute('aria-hidden')).toBe('true');
  });

  it('displays correct line numbers for multi-line diff', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'a\nb\n');
    await user.type(modified, 'a\nc\n');

    await user.click(screen.getByRole('button', { name: 'Lines' }));

    const origCells = container.querySelectorAll(
      '[data-testid="gutter-original"]',
    );
    const modCells = container.querySelectorAll(
      '[data-testid="gutter-modified"]',
    );
    expect(origCells.length).toBeGreaterThan(0);
    expect(modCells.length).toBeGreaterThan(0);

    expect(origCells[0].textContent).toBe('1');
    expect(modCells[0].textContent).toBe('1');
  });

  it('shows line number gutters in side-by-side view', async () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }) as unknown as typeof window.matchMedia;

    const user = userEvent.setup();
    const { container } = render(<App />);

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'a\nb');
    await user.type(modified, 'a\nc');

    await user.click(screen.getByRole('button', { name: 'Side-by-Side' }));

    const origGutter = container.querySelector(
      '[data-testid="sbs-gutter-original"]',
    );
    const modGutter = container.querySelector(
      '[data-testid="sbs-gutter-modified"]',
    );
    expect(origGutter).toBeInTheDocument();
    expect(modGutter).toBeInTheDocument();
  });
});
