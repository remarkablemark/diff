import { DiffMethodToggle } from 'src/components/DiffMethodToggle';
import { DiffViewer } from 'src/components/DiffViewer';
import { ScrollToTop } from 'src/components/ScrollToTop';
import { TextInput } from 'src/components/TextInput';
import { ViewToggle } from 'src/components/ViewToggle';
import { useDiff } from 'src/hooks/useDiff';
import { useMediaQuery } from 'src/hooks/useMediaQuery';
import { useQueryState } from 'src/hooks/useQueryState';

export function App() {
  const { queryState, updateQueryState } = useQueryState();
  const { original, modified, method, view } = queryState;

  const diffResult = useDiff(original, modified, method);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const effectiveViewMode = isDesktop ? view : 'unified';

  return (
    <>
      <ScrollToTop />
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
        📑 Diff
      </h1>

      <div className="flex flex-col gap-4 md:flex-row">
        <TextInput
          label="Original Text"
          value={original}
          onChange={(value) => {
            updateQueryState({ original: value });
          }}
          placeholder="Paste original text here..."
        />
        <TextInput
          label="Modified Text"
          value={modified}
          onChange={(value) => {
            updateQueryState({ modified: value });
          }}
          placeholder="Paste modified text here..."
        />
      </div>

      {diffResult && (
        <div className="mt-6">
          <div className="mb-1 flex items-center justify-between">
            <DiffMethodToggle
              activeMethod={method}
              onMethodChange={(newMethod) => {
                updateQueryState({ method: newMethod });
              }}
            />
            <ViewToggle
              activeMode={view}
              onModeChange={(newView) => {
                updateQueryState({ view: newView });
              }}
            />
          </div>
          <DiffViewer result={diffResult} viewMode={effectiveViewMode} />
        </div>
      )}
    </>
  );
}
