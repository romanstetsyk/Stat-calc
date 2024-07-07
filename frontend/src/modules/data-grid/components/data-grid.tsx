import '@glideapps/glide-data-grid/dist/index.css';

import type {
  DataEditorProps,
  DataEditorRef,
  GridColumn,
} from '@glideapps/glide-data-grid';
import { DataEditor } from '@glideapps/glide-data-grid';
import debounce from 'lodash-es/debounce';
import { useCallback, useMemo, useRef, useState } from 'react';

import { useBeforeUnload } from '~/common/hooks';

import { Config } from '../config';
import { useGridData, useUndoRedo } from '../hooks';
import { gridHeadersGenerator } from '../utils';

const generateHeaders = gridHeadersGenerator();

const DataGrid = (): JSX.Element => {
  const ref = useRef<DataEditorRef>(null);

  const {
    id,
    rowData,
    getContent,
    onCellsEdited,
    onGridSelectionChange,
    recentEdits: { currentSelection, canUndo, canRedo },
  } = useGridData();

  useUndoRedo(ref);

  const isDirty = canUndo || canRedo;
  useBeforeUnload('data', isDirty);

  const [rowCount, setRowCount] = useState<number>(Config.ROW_COUNT);
  const [columnHeaders, setColumnHeaders] = useState(() => generateHeaders());

  const onColumnResize = useCallback(
    (_col: GridColumn, newSize: number, colIndex: number) => {
      setColumnHeaders((prev) =>
        prev.map((header, idx) =>
          idx === colIndex ? { ...header, width: newSize } : header,
        ),
      );
    },
    [],
  );

  const onVisibleRegionChanged: DataEditorProps['onVisibleRegionChanged'] =
    useMemo(() => {
      const onVisibleRegionChanged: DataEditorProps['onVisibleRegionChanged'] =
        ({ x, y, width, height }) => {
          if (
            x + width >
            columnHeaders.length - Config.COLUMNS_LOAD_THRESHOLD
          ) {
            setColumnHeaders(
              generateHeaders(
                columnHeaders.length + Config.COLUMNS_ADDED_PER_SCROLL,
              ),
            );
          }
          if (y + height > rowCount - Config.ROWS_LOAD_THRESHOLD) {
            setRowCount(
              (prev) =>
                Math.max(prev, rowData.length) + Config.ROWS_ADDED_PER_SCROLL,
            );
          }
        };
      return debounce(onVisibleRegionChanged, Config.DEBOUNCE_TIMEOUT);
    }, [columnHeaders.length, rowCount, rowData.length]);

  return (
    <DataEditor
      ref={ref}
      key={id}
      getCellContent={getContent}
      columns={columnHeaders}
      rows={Math.max(rowCount, rowData.length)}
      rowHeight={Config.ROW_HEIGHT}
      headerHeight={Config.HEADER_HEIGHT}
      onCellsEdited={onCellsEdited}
      gridSelection={currentSelection}
      onGridSelectionChange={onGridSelectionChange}
      rowMarkers='clickable-number'
      getCellsForSelection={true}
      onPaste={true}
      onColumnResize={onColumnResize}
      scaleToRem={true}
      onVisibleRegionChanged={onVisibleRegionChanged}
    />
  );
};

export { DataGrid };
