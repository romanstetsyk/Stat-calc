/* eslint-disable @typescript-eslint/no-magic-numbers */
import '@glideapps/glide-data-grid/dist/index.css';

import type {
  DataEditorRef,
  GridColumn,
  SizedGridColumn,
} from '@glideapps/glide-data-grid';
import { DataEditor } from '@glideapps/glide-data-grid';
import { debounce } from 'lodash-es';
import { useCallback, useMemo, useRef, useState } from 'react';

import { useGridData } from '~/store/grid-data';
import { createColName } from '~/utils/create-col-name';

const ROW_COUNT = 300;
const ROW_HEIGHT = 24;
const COL_COUNT = 50;
const COL_WIDTH = 100;
const HEADER_HEIGHT = 28;

const generateHeaders = (colCount: number = COL_COUNT): SizedGridColumn[] =>
  Array.from({ length: colCount }, (_, i) => {
    const colName = createColName(i);
    const col: GridColumn = {
      title: colName,
      id: colName,
      width: COL_WIDTH,
    };
    return col;
  });

const DataGrid = (): JSX.Element => {
  const ref = useRef<DataEditorRef>(null);

  const { datasetId, onCellsEdited, rowData, getContent } = useGridData();

  const [rowCount, setRowCount] = useState<number>(ROW_COUNT);
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
        if (x + width > columnHeaders.length - 5) {
          setColumnHeaders(generateHeaders(columnHeaders.length + 10));
        }
        if (y + height > rowCount - 40) {
          setRowCount((prev) => Math.max(prev, rowData.length) + 50);
        }
      }, 100),
    [columnHeaders.length, rowCount, rowData.length],
  );

  return (
    <DataEditor
      ref={ref}
      key={datasetId}
      getCellContent={getContent}
      columns={columnHeaders}
      rows={Math.max(rowCount, rowData.length)}
      rowHeight={ROW_HEIGHT}
      headerHeight={HEADER_HEIGHT}
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
