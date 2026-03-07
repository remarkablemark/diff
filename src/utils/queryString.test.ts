import type { DiffMethod } from 'src/types/diff';

import { decodeQueryState, encodeQueryState } from './queryString';

describe('encodeQueryState', () => {
  it('encodes all fields', () => {
    const state = {
      original: 'hello',
      modified: 'world',
      method: 'words' as DiffMethod,
      view: 'unified' as const,
    };

    const params = encodeQueryState(state);

    expect(params.get('original')).toBeTruthy();
    expect(params.get('modified')).toBeTruthy();
    expect(params.get('method')).toBe('words');
    expect(params.get('view')).toBe('unified');
  });

  it('handles empty text fields', () => {
    const state = {
      original: '',
      modified: '',
      method: 'words' as DiffMethod,
      view: 'unified' as const,
    };

    const params = encodeQueryState(state);

    expect(params.get('original')).toBe('');
    expect(params.get('modified')).toBe('');
  });

  it('compresses text fields', () => {
    const longText = 'a'.repeat(1000);
    const state = {
      original: longText,
      modified: longText,
      method: 'words' as DiffMethod,
      view: 'unified' as const,
    };

    const params = encodeQueryState(state);
    const compressed = params.get('original');

    expect(compressed).toBeTruthy();
    if (compressed) {
      expect(compressed.length).toBeLessThan(longText.length);
    }
  });

  it('encodes all diff methods', () => {
    const methods: DiffMethod[] = ['characters', 'words', 'lines'];

    methods.forEach((method) => {
      const state = {
        original: '',
        modified: '',
        method,
        view: 'unified' as const,
      };

      const params = encodeQueryState(state);
      expect(params.get('method')).toBe(method);
    });
  });

  it('encodes all view modes', () => {
    const views = ['unified', 'side-by-side'] as const;

    views.forEach((view) => {
      const state = {
        original: '',
        modified: '',
        method: 'words' as DiffMethod,
        view,
      };

      const params = encodeQueryState(state);
      expect(params.get('view')).toBe(view);
    });
  });
});

describe('decodeQueryState', () => {
  it('decodes all fields from URL params', () => {
    const original = 'hello';
    const modified = 'world';
    const encoded = encodeQueryState({
      original,
      modified,
      method: 'lines',
      view: 'side-by-side',
    });

    const decoded = decodeQueryState(encoded, {
      original: '',
      modified: '',
      method: 'words',
      view: 'unified',
    });

    expect(decoded.original).toBe(original);
    expect(decoded.modified).toBe(modified);
    expect(decoded.method).toBe('lines');
    expect(decoded.view).toBe('side-by-side');
  });

  it('uses fallback for missing parameters', () => {
    const params = new URLSearchParams();

    const decoded = decodeQueryState(params, {
      original: 'default-original',
      modified: 'default-modified',
      method: 'characters',
      view: 'unified',
    });

    expect(decoded.original).toBe('default-original');
    expect(decoded.modified).toBe('default-modified');
    expect(decoded.method).toBe('characters');
    expect(decoded.view).toBe('unified');
  });

  it('uses fallback for invalid method values', () => {
    const params = new URLSearchParams('?method=invalid');

    const decoded = decodeQueryState(params, {
      original: '',
      modified: '',
      method: 'words',
      view: 'unified',
    });

    expect(decoded.method).toBe('words');
  });

  it('uses fallback for invalid view values', () => {
    const params = new URLSearchParams('?view=invalid');

    const decoded = decodeQueryState(params, {
      original: '',
      modified: '',
      method: 'words',
      view: 'unified',
    });

    expect(decoded.view).toBe('unified');
  });

  it('handles corrupted compressed data', () => {
    const params = new URLSearchParams(
      '?original=corrupted!!!&modified=bad!!!',
    );

    const decoded = decodeQueryState(params, {
      original: '',
      modified: '',
      method: 'words',
      view: 'unified',
    });

    expect(decoded.original).toBe('');
    expect(decoded.modified).toBe('');
  });

  it('handles partial state', () => {
    const params = new URLSearchParams('?method=lines');

    const decoded = decodeQueryState(params, {
      original: 'fallback-original',
      modified: 'fallback-modified',
      method: 'words',
      view: 'unified',
    });

    expect(decoded.original).toBe('fallback-original');
    expect(decoded.modified).toBe('fallback-modified');
    expect(decoded.method).toBe('lines');
    expect(decoded.view).toBe('unified');
  });

  it('preserves unrelated query parameters', () => {
    const params = new URLSearchParams('?method=lines&unrelated=value');

    const decoded = decodeQueryState(params, {
      original: '',
      modified: '',
      method: 'words',
      view: 'unified',
    });

    expect(decoded.method).toBe('lines');
    expect(params.get('unrelated')).toBe('value');
  });
});
