import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TextInput from '.';

describe('TextInput component', () => {
  const defaultProps = {
    label: 'Original Text',
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders textarea with associated label', () => {
    render(<TextInput {...defaultProps} />);

    const textarea = screen.getByLabelText('Original Text');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('renders with placeholder text', () => {
    render(<TextInput {...defaultProps} placeholder="Enter text here..." />);

    const textarea = screen.getByPlaceholderText('Enter text here...');
    expect(textarea).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<TextInput {...defaultProps} value="hello world" />);

    const textarea = screen.getByLabelText('Original Text');
    expect(textarea).toHaveValue('hello world');
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextInput {...defaultProps} onChange={onChange} />);

    const textarea = screen.getByLabelText('Original Text');
    await user.type(textarea, 'a');

    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('renders line number gutter with aria-hidden', () => {
    render(<TextInput {...defaultProps} value="line 1\nline 2\nline 3" />);

    const gutter = screen.getByTestId('line-gutter');
    expect(gutter).toHaveAttribute('aria-hidden', 'true');
  });

  it('displays correct number of line numbers', () => {
    render(<TextInput {...defaultProps} value={'line 1\nline 2\nline 3'} />);

    const gutter = screen.getByTestId('line-gutter');
    expect(gutter).toHaveTextContent('1');
    expect(gutter).toHaveTextContent('2');
    expect(gutter).toHaveTextContent('3');
  });

  it('shows at least one line number for empty input', () => {
    render(<TextInput {...defaultProps} value="" />);

    const gutter = screen.getByTestId('line-gutter');
    expect(gutter).toHaveTextContent('1');
  });

  it('syncs gutter scroll with textarea scroll', () => {
    render(<TextInput {...defaultProps} value="line 1\nline 2" />);

    const textarea = screen.getByLabelText('Original Text');
    const gutter = screen.getByTestId('line-gutter');

    Object.defineProperty(textarea, 'scrollTop', {
      writable: true,
      value: 50,
    });

    textarea.dispatchEvent(new Event('scroll', { bubbles: true }));

    expect(gutter.scrollTop).toBe(50);
  });
});
