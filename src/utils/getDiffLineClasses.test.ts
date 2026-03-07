import { getDiffLineClasses } from './getDiffLineClasses';

describe('getDiffLineClasses', () => {
  it('returns base classes for unchanged lines', () => {
    const result = getDiffLineClasses('unchanged');

    expect(result.lineNumberClasses).toBe(
      'w-8 px-2 text-right font-mono text-sm leading-6 text-gray-500 dark:text-gray-400',
    );
    expect(result.contentClasses).toBe(
      'pl-2 font-mono text-sm leading-6 dark:text-gray-100',
    );
  });

  it('returns base classes for null (placeholder)', () => {
    const result = getDiffLineClasses(null);

    expect(result.lineNumberClasses).toBe(
      'w-8 px-2 text-right font-mono text-sm leading-6 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800',
    );
    expect(result.contentClasses).toBe(
      'pl-2 font-mono text-sm leading-6 dark:text-gray-100 bg-gray-100 dark:bg-gray-800',
    );
  });

  it('uses custom content base classes when provided', () => {
    const customBase =
      'min-w-0 flex-1 pl-2 font-mono text-sm leading-6 text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words';
    const result = getDiffLineClasses('added', {
      contentBaseClasses: customBase,
    });

    expect(result.lineNumberClasses).toBe(
      'w-8 px-2 text-right font-mono text-sm leading-6 text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-green-900/20',
    );
    expect(result.contentClasses).toBe(
      `${customBase} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`,
    );
  });
});
