import type {
  DataEditorProps,
  DataEditorRef,
  EditableGridCell,
  EditListItem,
  GridSelection,
} from '@glideapps/glide-data-grid';
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import { useGridData } from './use-grid-data';

type Batch = {
  edits: EditListItem[];
  selection: GridSelection;
};

type ReducerState = {
  undoHistory: Batch[];
  redoHistory: Batch[];
  canUndo: boolean;
  canRedo: boolean;
  isApplyingUndo: boolean;
  isApplyingRedo: boolean;

  operation?: Batch;
};

const initialState: ReducerState = {
  undoHistory: [],
  redoHistory: [],
  canUndo: false,
  canRedo: false,
  isApplyingUndo: false,
  isApplyingRedo: false,
};

type Action = UndoRedoAction | EditAction;

type UndoRedoAction = {
  type: 'undo' | 'redo' | 'operationApplied';
};

type EditAction = {
  type: 'edit';
  batch: Batch;
};

function reducer(state: ReducerState, action: Action): ReducerState {
  const newState = { ...state };

  switch (action.type) {
    case 'undo': {
      if (state.canUndo) {
        newState.undoHistory = [...state.undoHistory];
        const operation = newState.undoHistory.pop();
        newState.operation = operation;
        newState.canUndo = newState.undoHistory.length > 0;
        newState.isApplyingUndo = true;

        return newState;
      }
      return state;
    }

    case 'redo': {
      if (state.canRedo) {
        newState.redoHistory = [...state.redoHistory];
        const operation = newState.redoHistory.pop();
        newState.operation = operation;
        newState.canRedo = newState.redoHistory.length > 0;
        newState.isApplyingRedo = true;

        return newState;
      }
      return state;
    }

    case 'operationApplied': {
      newState.operation = undefined;
      newState.isApplyingRedo = false;
      newState.isApplyingUndo = false;

      return newState;
    }

    case 'edit': {
      if (!state.isApplyingRedo && !state.isApplyingUndo) {
        // general case
        newState.undoHistory = [...state.undoHistory, action.batch];
        newState.redoHistory = [];
        newState.canUndo = true;
        newState.canRedo = false;
      }

      if (state.isApplyingUndo) {
        newState.redoHistory = [...state.redoHistory, action.batch];
        newState.canRedo = true;
      }

      if (state.isApplyingRedo) {
        newState.undoHistory = [...state.undoHistory, action.batch];
        newState.canUndo = true;
      }

      return newState;
    }

    default: {
      throw new Error('Invalid action');
    }
  }
}

function useUndoRedo(gridRef: React.RefObject<DataEditorRef>): {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onCellsEdited: NonNullable<DataEditorProps['onCellsEdited']>;
  onGridSelectionChange: (newVal: GridSelection) => void;
  gridSelection: GridSelection | undefined;
} {
  const [state, dispatch] = useReducer(reducer, initialState);

  const currentBatch = useRef<Batch | null>(null);
  const timeout = useRef<NodeJS.Timeout>();

  const isApplyingUndoRef = useRef(false);
  const isApplyingRedoRef = useRef(false);
  useEffect(() => {
    isApplyingUndoRef.current = state.isApplyingUndo;
    isApplyingRedoRef.current = state.isApplyingRedo;
  }, [state.isApplyingUndo, state.isApplyingRedo]);

  const [gridSelection, setGridSelection] = useState<GridSelection>();
  const gridSelectionRef = useRef<GridSelection | null>(null);

  const { getContent, onCellsEdited } = useGridData();

  const onGridSelectionChangedEdited = useCallback((newVal: GridSelection) => {
    setGridSelection(newVal);
    gridSelectionRef.current = newVal;
  }, []);

  const wrappedOnCellsEdited: DataEditorProps['onCellsEdited'] = useCallback(
    (newValues: readonly EditListItem[]) => {
      if (!onCellsEdited) {
        return;
      }

      const isApplyingUpdate =
        isApplyingUndoRef.current || isApplyingRedoRef.current;

      if (!isApplyingUpdate && gridSelectionRef.current) {
        clearTimeout(timeout.current);
        const edits = newValues.map(({ location }) => ({
          location,
          value: getContent(location) as EditableGridCell,
        }));

        if (currentBatch.current === null) {
          currentBatch.current = {
            edits: [],
            selection: gridSelectionRef.current,
          };
        }
        currentBatch.current.edits = edits;
        // When pasting lots of edits arrive sequentially. Undo/redo should replay in a batch so using a timeout to kick to the end of the event loop
        timeout.current = setTimeout(() => {
          if (currentBatch.current) {
            dispatch({
              type: 'edit',
              batch: currentBatch.current,
            });
            currentBatch.current = null;
          }
        }, 0);
      }

      // Continue with the edit
      return onCellsEdited(newValues);
    },
    [getContent, onCellsEdited],
  );

  const undo = useCallback(() => {
    dispatch({ type: 'undo' });
  }, [dispatch]);

  const redo = useCallback(() => {
    dispatch({ type: 'redo' });
  }, [dispatch]);

  // Apply a batch of edits to the grid
  useEffect(() => {
    if (!onCellsEdited) {
      return;
    }

    if (state.operation && gridSelectionRef.current && gridRef.current) {
      const edits = state.operation.edits.map(({ location }) => ({
        location,
        value: getContent(location) as EditableGridCell,
      }));

      const previousState: Batch = {
        edits,
        selection: gridSelectionRef.current,
      };

      const cells = state.operation.edits.map(({ location }) => ({
        cell: location,
      }));

      onCellsEdited(state.operation.edits);

      setGridSelection(state.operation.selection);
      gridSelectionRef.current = state.operation.selection;
      gridRef.current.updateCells(cells);

      dispatch({ type: 'edit', batch: previousState });
      dispatch({ type: 'operationApplied' });
    }
  }, [getContent, gridRef, onCellsEdited, state.operation]);

  // Attach the keyboard shortcuts. CMD+Z and CMD+SHIFT+Z on mac, CTRL+Z and CTRL+Y on windows.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      if (e.key === 'y' && (e.metaKey || e.ctrlKey)) {
        redo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [undo, redo]);

  return useMemo(() => {
    return {
      undo,
      redo,
      canUndo: state.canUndo,
      canRedo: state.canRedo,
      onCellsEdited: wrappedOnCellsEdited,
      onGridSelectionChange: onGridSelectionChangedEdited,
      gridSelection,
    };
  }, [
    undo,
    redo,
    state.canUndo,
    state.canRedo,
    wrappedOnCellsEdited,
    onGridSelectionChangedEdited,
    gridSelection,
  ]);
}

export { useUndoRedo };
