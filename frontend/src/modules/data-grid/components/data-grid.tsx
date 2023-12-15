import '@glideapps/glide-data-grid/dist/index.css';

import type { DataEditorRef, GridColumn } from '@glideapps/glide-data-grid';
import { DataEditor } from '@glideapps/glide-data-grid';
import { debounce } from 'lodash-es';
import { useCallback, useMemo, useRef, useState } from 'react';

import { Config } from '../config';
import { useGridData } from '../store';
import { gridHeadersGenerator } from '../utils';

const generateHeaders = gridHeadersGenerator();

const DataGrid = (): JSX.Element => {
  const ref = useRef<DataEditorRef>(null);

  const { datasetId, onCellsEdited, rowData, getContent } = useGridData();

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

  const onVisibleRegionChanged = useMemo(
    () =>
      debounce(({ x, y, width, height }) => {
        if (x + width > columnHeaders.length - Config.COLUMNS_LOAD_THRESHOLD) {
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
      }, Config.DEBOUNCE_TIMEOUT),
    [columnHeaders.length, rowCount, rowData.length],
  );

  return (
    <DataEditor
      ref={ref}
      key={datasetId}
      getCellContent={getContent}
      columns={columnHeaders}
      rows={Math.max(rowCount, rowData.length)}
      rowHeight={Config.ROW_HEIGHT}
      headerHeight={Config.HEADER_HEIGHT}
      onCellsEdited={onCellsEdited}
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
