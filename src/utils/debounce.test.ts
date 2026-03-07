import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('delays function execution', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 500);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('cancels pending calls on new input', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 500);

    debounced('first');
    vi.advanceTimersByTime(200);

    debounced('second');
    vi.advanceTimersByTime(200);

    debounced('third');
    vi.advanceTimersByTime(500);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('third');
  });

  it('preserves function arguments', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 500);

    debounced('arg1', 'arg2', 'arg3');
    vi.advanceTimersByTime(500);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
  });

  it('handles multiple separate invocations', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 500);

    debounced('first');
    vi.advanceTimersByTime(500);

    debounced('second');
    vi.advanceTimersByTime(500);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, 'first');
    expect(fn).toHaveBeenNthCalledWith(2, 'second');
  });

  it('handles zero delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 0);

    debounced();
    vi.advanceTimersByTime(0);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
