import { compressText, decompressText } from './compression';

describe('compressText', () => {
  it('compresses non-empty text', () => {
    const text = 'hello world'.repeat(10);
    const result = compressText(text);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result.length).toBeLessThan(text.length);
  });

  it('returns empty string for empty input', () => {
    expect(compressText('')).toBe('');
  });

  it('handles unicode characters', () => {
    const text = 'Hello 世界 🌍';
    const compressed = compressText(text);
    expect(compressed).toBeTruthy();
    expect(typeof compressed).toBe('string');
  });

  it('handles multi-line text', () => {
    const text = 'line 1\nline 2\nline 3';
    const compressed = compressText(text);
    expect(compressed).toBeTruthy();
    expect(typeof compressed).toBe('string');
  });

  it('produces URL-safe output', () => {
    const text = 'test with spaces and special chars: !@#$%';
    const compressed = compressText(text);
    expect(compressed).not.toMatch(/[^A-Za-z0-9+\-_]/);
  });
});

describe('decompressText', () => {
  it('decompresses valid compressed text', () => {
    const original = 'hello world';
    const compressed = compressText(original);
    const decompressed = decompressText(compressed);
    expect(decompressed).toBe(original);
  });

  it('returns empty string for empty input', () => {
    expect(decompressText('')).toBe('');
  });

  it('returns empty string for corrupted data', () => {
    expect(decompressText('invalid!!!')).toBe('');
  });

  it('handles unicode round-trip', () => {
    const original = 'Hello 世界 🌍';
    const compressed = compressText(original);
    const decompressed = decompressText(compressed);
    expect(decompressed).toBe(original);
  });

  it('handles multi-line round-trip', () => {
    const original = 'line 1\nline 2\nline 3';
    const compressed = compressText(original);
    const decompressed = decompressText(compressed);
    expect(decompressed).toBe(original);
  });

  it('handles large text', () => {
    const original = 'a'.repeat(10000);
    const compressed = compressText(original);
    const decompressed = decompressText(compressed);
    expect(decompressed).toBe(original);
  });

  it('returns empty string when decompression returns null', () => {
    const result = decompressText('!@#$%^&*()');
    expect(result).toBe('');
  });
});
