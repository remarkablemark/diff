import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ViewToggle } from './ViewToggle';

describe('ViewToggle component', () => {
  const defaultProps = {
    activeMode: 'unified' as const,
    onModeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders two buttons for unified and side-by-side', () => {
    render(<ViewToggle {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /unified/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /side-by-side/i }),
    ).toBeInTheDocument();
  });

  it('highlights active mode and shows inactive state for other button', () => {
    render(<ViewToggle {...defaultProps} activeMode="unified" />);

    const unifiedButton = screen.getByRole('button', { name: /unified/i });
    const sideBySideButton = screen.getByRole('button', {
      name: /side-by-side/i,
    });

    expect(unifiedButton.className).toContain('bg-blue-500');
    expect(sideBySideButton.className).toContain('bg-gray-100');
  });

  it('calls onModeChange with "unified" when unified button is clicked', async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();
    render(
      <ViewToggle activeMode="side-by-side" onModeChange={onModeChange} />,
    );

    const unifiedButton = screen.getByRole('button', { name: /unified/i });
    await user.click(unifiedButton);

    expect(onModeChange).toHaveBeenCalledWith('unified');
  });

  it('calls onModeChange with "side-by-side" when side-by-side button is clicked', async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();
    render(<ViewToggle activeMode="unified" onModeChange={onModeChange} />);

    const sideBySideButton = screen.getByRole('button', {
      name: /side-by-side/i,
    });
    await user.click(sideBySideButton);

    expect(onModeChange).toHaveBeenCalledWith('side-by-side');
  });

  it('is keyboard accessible', async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();
    render(<ViewToggle activeMode="unified" onModeChange={onModeChange} />);

    await user.tab();
    const unifiedButton = screen.getByRole('button', { name: /unified/i });
    expect(unifiedButton).toHaveFocus();

    await user.tab();
    const sideBySideButton = screen.getByRole('button', {
      name: /side-by-side/i,
    });
    expect(sideBySideButton).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onModeChange).toHaveBeenCalledWith('side-by-side');
  });
});
