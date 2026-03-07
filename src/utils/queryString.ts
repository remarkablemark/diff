import type { DiffMethod, QueryState, ViewMode } from 'src/types/diff';

import { compressText, decompressText } from './compression';

export function encodeQueryState(state: QueryState): URLSearchParams {
  const params = new URLSearchParams();

  params.set('original', compressText(state.original));
  params.set('modified', compressText(state.modified));
  params.set('method', state.method);
  params.set('view', state.view);

  return params;
}

export function decodeQueryState(
  params: URLSearchParams,
  fallback: Partial<QueryState>,
): QueryState {
  const original = params.get('original');
  const modified = params.get('modified');
  const method = params.get('method');
  const view = params.get('view');

  const validMethods: DiffMethod[] = ['characters', 'words', 'lines'];
  const validViews: ViewMode[] = ['unified', 'side-by-side'];

  return {
    /* v8 ignore next */
    original: original ? decompressText(original) : (fallback.original ?? ''),
    /* v8 ignore next */
    modified: modified ? decompressText(modified) : (fallback.modified ?? ''),
    method: validMethods.includes(method as DiffMethod)
      ? (method as DiffMethod)
      : /* v8 ignore next */
        (fallback.method ?? 'words'),
    view: validViews.includes(view as ViewMode)
      ? (view as ViewMode)
      : /* v8 ignore next */
        (fallback.view ?? 'unified'),
  };
}
