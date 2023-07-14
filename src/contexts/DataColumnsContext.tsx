import { createContext, useCallback, useMemo, useState } from "react";
import { Rectangle } from "@glideapps/glide-data-grid";
import { ColumnValues, GridColumnName, GridRow } from "~/Types";

function getColumns(rows: GridRow[]): ColumnValues {
  const columns: ColumnValues = {};
  for (const obj of rows) {
    if (!obj) continue;
    (Object.keys(obj) as Array<keyof GridRow>).forEach((key) => {
      if (obj[key] !== "") {
        columns[key] = (columns[key] || []).concat([obj[key]]);
      }
    });
  }
  return columns;
}

// remove trailing empty slots in sparse array
const adjustLength = (arr: unknown[]) =>
  (arr.length = arr.findLastIndex((e) => e !== undefined) + 1);

const useProvideData = () => {
  const [rowData, setRowData] = useState<GridRow[]>([]);
  const columnData = useMemo(() => getColumns(rowData), [rowData]);

  const delRows = useCallback((indices: number[]) => {
    setRowData((prev) => {
      indices.forEach((idx) => delete prev[idx]);
      adjustLength(prev);
      return prev.slice();
    });
  }, []);

  const delColumns = useCallback((indices: number[]) => {
    setRowData((prev) => {
      prev.forEach((obj) =>
        indices.forEach((idx) => delete obj[`col${idx + 1}`])
      );
      prev.forEach((obj, i) => {
        if (Object.keys(obj).length === 0) {
          delete prev[i];
        }
      });
      adjustLength(prev);
      return prev.slice();
    });
  }, []);

  const delCells = useCallback(({ x, y, width, height }: Rectangle) => {
    const headers = Array.from<unknown, GridColumnName>(
      { length: width },
      (_, i) => `col${i + 1 + x}`
    );
    setRowData((prev) => {
      for (let i = y; i < y + height; i += 1) {
        headers.forEach((header) => {
          if (prev[i]) {
            delete prev[i][header];
            if (Object.keys(prev[i]).length === 0) {
              delete prev[i];
            }
          }
        });
      }
      adjustLength(prev);
      return prev.slice();
    });
  }, []);

  return { rowData, setRowData, columnData, delRows, delColumns, delCells };
};

export const DataColumnsContext = createContext<
  ReturnType<typeof useProvideData>
>({} as ReturnType<typeof useProvideData>);

type Props = {
  children: React.ReactNode;
};

export const DataColumnsProvider = ({ children }: Props) => {
  const data = useProvideData();

  return (
    <DataColumnsContext.Provider value={data}>
      {children}
    </DataColumnsContext.Provider>
  );
};
