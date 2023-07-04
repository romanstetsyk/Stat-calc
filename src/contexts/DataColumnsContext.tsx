import { createContext, useMemo, useState } from "react";
import { ColumnValues, GridRow } from "~/Types";

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

const useProvideData = () => {
  const [rowData, setRowData] = useState<GridRow[]>([]);
  const columnData = useMemo(() => getColumns(rowData), [rowData]);
  return { rowData, setRowData, columnData };
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
