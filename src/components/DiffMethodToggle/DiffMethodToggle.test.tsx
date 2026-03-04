import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DiffMethodToggle from './DiffMethodToggle';

describe('DiffMethodToggle', () => {
  const defaultProps = {
    activeMethod: 'words' as const,
    onMethodChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders three buttons for characters, words, and lines', () => {
    render(<DiffMethodToggle {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: 'Characters' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Words' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lines' })).toBeInTheDocument();
  });

  it('renders a group with accessible label', () => {
    render(<DiffMethodToggle {...defaultProps} />);

    expect(
      screen.getByRole('group', { name: 'Diff method' }),
    ).toBeInTheDocument();
  });

  it('highlights the active method button', () => {
    render(<DiffMethodToggle {...defaultProps} activeMethod="lines" />);

    const linesButton = screen.getByRole('button', { name: 'Lines' });
    expect(linesButton.className).toContain('bg-blue-500');

    const wordsButton = screen.getByRole('button', { name: 'Words' });
    expect(wordsButton.className).not.toContain('bg-blue-500');
  });

  it.each([
    { buttonName: 'Characters', expectedValue: 'characters' },
    { buttonName: 'Words', expectedValue: 'words' },
    { buttonName: 'Lines', expectedValue: 'lines' },
  ])(
    'calls onMethodChange with "$expectedValue" when $buttonName is clicked',
    async ({ buttonName, expectedValue }) => {
      const user = userEvent.setup();
      const onMethodChange = vi.fn();
      render(
        <DiffMethodToggle {...defaultProps} onMethodChange={onMethodChange} />,
      );

      await user.click(screen.getByRole('button', { name: buttonName }));

      expect(onMethodChange).toHaveBeenCalledWith(expectedValue);
    },
  );

  it('is keyboard accessible via Enter key', async () => {
    const user = userEvent.setup();
    const onMethodChange = vi.fn();
    render(
      <DiffMethodToggle {...defaultProps} onMethodChange={onMethodChange} />,
    );

    const charsButton = screen.getByRole('button', { name: 'Characters' });
    charsButton.focus();
    await user.keyboard('{Enter}');

    expect(onMethodChange).toHaveBeenCalledWith('characters');
  });
});
