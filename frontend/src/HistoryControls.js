import { useEffect } from 'react';
import { useStore } from './store';

const selector = (state) => ({
  undo: state.undo,
  redo: state.redo,
  clear: state.clear,
  canUndo: state.past.length > 0,
  canRedo: state.future.length > 0,
  hasContent: state.nodes.length > 0 || state.edges.length > 0,
});

const isEditableTarget = (target) =>
  target instanceof HTMLElement &&
  (target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable);

export const HistoryControls = () => {
  const { undo, redo, clear, canUndo, canRedo, hasContent } =
    useStore(selector);

  useEffect(() => {
    const onKeyDown = (event) => {
      const isMod = event.metaKey || event.ctrlKey;
      if (!isMod) return;
      if (isEditableTarget(event.target)) return;

      if (event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      } else if (
        (event.key === 'z' && event.shiftKey) ||
        event.key === 'y'
      ) {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo, redo]);

  const onClear = () => {
    if (!hasContent) return;
    if (window.confirm('Clear the entire pipeline? This can be undone.')) {
      clear();
    }
  };

  return (
    <>
      <button
        type="button"
        className="vs-btn vs-btn--ghost vs-btn--icon"
        onClick={undo}
        disabled={!canUndo}
        title="Undo (⌘Z)"
        aria-label="Undo"
      >
        <UndoIcon />
      </button>
      <button
        type="button"
        className="vs-btn vs-btn--ghost vs-btn--icon vs-redo-btn"
        onClick={redo}
        disabled={!canRedo}
        title="Redo (⇧⌘Z)"
        aria-label="Redo"
      >
        <RedoIcon />
      </button>
      <button
        type="button"
        className="vs-btn"
        onClick={onClear}
        disabled={!hasContent}
        title="Clear canvas"
      >
        Clear
      </button>
    </>
  );
};

const UndoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
  </svg>
);

const RedoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 7v6h-6" />
    <path d="M3 17a9 9 0 0 1 15-6.7L21 13" />
  </svg>
);
