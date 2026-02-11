import { useState } from 'react';
import DiffMethodToggle from 'src/components/DiffMethodToggle';
import DiffViewer from 'src/components/DiffViewer';
import TextInput from 'src/components/TextInput';
import ViewToggle from 'src/components/ViewToggle';
import { useDiff } from 'src/hooks/useDiff';
import { useLocalStorage } from 'src/hooks/useLocalStorage';
import { useMediaQuery } from 'src/hooks/useMediaQuery';
import type { DiffMethod, ViewMode } from 'src/types/diff';

export default function App() {
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    'diff.viewMode',
    'unified',
  );
  const [diffMethod, setDiffMethod] = useLocalStorage<DiffMethod>(
    'diff.diffMethod',
    'words',
  );

  const diffResult = useDiff(originalText, modifiedText, diffMethod);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const effectiveViewMode = isDesktop ? viewMode : 'unified';

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
        📝 Diff
      </h1>

      <div className="flex flex-col gap-4 md:flex-row">
        <TextInput
          label="Original Text"
          value={originalText}
          onChange={setOriginalText}
          placeholder="Paste original text here..."
        />
        <TextInput
          label="Modified Text"
          value={modifiedText}
          onChange={setModifiedText}
          placeholder="Paste modified text here..."
        />
      </div>

      {diffResult && (
        <div className="mt-6">
          <div className="mb-1 flex items-center justify-between">
            <DiffMethodToggle
              activeMethod={diffMethod}
              onMethodChange={setDiffMethod}
            />
            <ViewToggle activeMode={viewMode} onModeChange={setViewMode} />
          </div>
          <DiffViewer result={diffResult} viewMode={effectiveViewMode} />
        </div>
      )}
    </>
  );
}
