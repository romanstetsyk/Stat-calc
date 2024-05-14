import type { DataEditorRef, Item } from '@glideapps/glide-data-grid';
import { useEffect } from 'react';

import { useGridData } from './use-grid-data';

const useUndoRedo = (gridRef: React.RefObject<DataEditorRef>): void => {
  const {
    recentEdits: { undo, redo },
  } = useGridData();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      let cells: { cell: Item }[] | undefined;
      if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
        cells = e.shiftKey ? redo() : undo();
      }
      if (e.key === 'y' && (e.metaKey || e.ctrlKey)) {
        cells = redo();
      }
      if (cells) {
        gridRef.current?.updateCells(cells);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [gridRef, redo, undo]);
};

export { useUndoRedo };
