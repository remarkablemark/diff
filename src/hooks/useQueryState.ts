import { useCallback, useEffect, useRef, useState } from 'react';
import type { QueryState } from 'src/types/diff';
import { debounce } from 'src/utils/debounce';
import { decodeQueryState, encodeQueryState } from 'src/utils/queryString';

const MAX_URL_LENGTH = 2000;
const DEBOUNCE_MILLISECONDS = 500;

export function useQueryState(): {
  queryState: QueryState;
  updateQueryState: (updates: Partial<QueryState>) => void;
} {
  const getInitialState = useCallback((): QueryState => {
    const params = new URLSearchParams(window.location.search);

    const getStoredValue = <T>(key: string, defaultValue: T): T => {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      try {
        return JSON.parse(item) as T;
      } catch {
        return defaultValue;
      }
    };

    const fallback: Partial<QueryState> = {
      original: getStoredValue('diff.original', ''),
      modified: getStoredValue('diff.modified', ''),
      method: getStoredValue('diff.diffMethod', 'words'),
      view: getStoredValue('diff.viewMode', 'unified'),
    };

    return decodeQueryState(params, fallback);
  }, []);

  const [queryState, setQueryState] = useState<QueryState>(getInitialState);

  const debouncedUpdateURL = useRef(
    debounce((state: QueryState) => {
      const existingParams = new URLSearchParams(window.location.search);
      const newParams = encodeQueryState(state);

      for (const [key, value] of existingParams.entries()) {
        /* v8 ignore start */
        if (!['original', 'modified', 'method', 'view'].includes(key)) {
          newParams.set(key, value);
        }
        /* v8 ignore stop */
      }

      const newURL = `${window.location.pathname}?${newParams.toString()}`;

      /* v8 ignore start */
      if (newURL.length > MAX_URL_LENGTH) {
        // eslint-disable-next-line no-console
        console.warn(
          `URL length (${String(newURL.length)}) exceeds recommended limit (${String(MAX_URL_LENGTH)}). Some browsers may not support URLs this long.`,
        );
      }
      /* v8 ignore stop */

      window.history.replaceState(null, '', newURL);
    }, DEBOUNCE_MILLISECONDS),
  ).current;

  const updateQueryState = useCallback(
    (updates: Partial<QueryState>) => {
      setQueryState((prev) => {
        const newState = { ...prev, ...updates };
        debouncedUpdateURL(newState);
        return newState;
      });
    },
    [debouncedUpdateURL],
  );

  useEffect(() => {
    const handlePopState = () => {
      setQueryState(getInitialState());
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [getInitialState]);

  return { queryState, updateQueryState };
}
