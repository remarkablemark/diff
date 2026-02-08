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

  it('renders "Diff" label when diff output is visible', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByText('Diff')).not.toBeInTheDocument();

    const original = screen.getByLabelText('Original Text');
    const modified = screen.getByLabelText('Modified Text');

    await user.type(original, 'hello');
    await user.type(modified, 'hello');

    expect(screen.getByText('Diff')).toBeInTheDocument();
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
});
