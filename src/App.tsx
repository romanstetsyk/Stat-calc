import { useCallback, useState } from "react";
import DataEditor, {
  EditableGridCell,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import { StatModal as OneSampleZSummaryModal } from "./features/OneSampleZSummary/StatModal";
import { StatModal as OneSampleZDataModal } from "./features/OneSampleZData/StatModal";
import { StatModal as DescriptiveStatisticsModal } from "./features/DescriptiveStatistics/StatModal";
import { StatModal as TwoSampleZSummaryModal } from "./features/TwoSampleZSummary/StatModal";
import { StatModal as TwoSampleZDataModal } from "./features/TwoSampleZData/StatModal";
import { ColumnValues, GridColumnName, GridRow } from "./Types";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuGroup,
  MenuDivider,
} from "@chakra-ui/react";

const columnHeaders: GridColumn[] = Array.from({ length: 5 }, (_, i) => {
  const col: { title: GridColumnName; width: number } = {
    title: `col${i + 1}`,
    width: 100,
  };
  return col;
});

function getColumns(rows: GridRow[]): ColumnValues {
  const columns: ColumnValues = {};
  for (const obj of rows) {
    if (!obj) continue;
    (Object.keys(obj) as Array<keyof GridRow>).forEach((key) => {
      columns[key] = (columns[key] || []).concat([obj[key]]);
    });
  }
  return columns;
}

function App() {
  const [data, setData] = useState<GridRow[]>([]);

  const columns = getColumns(data);

  const getContent = useCallback(
    (cell: Item): GridCell => {
      const [col, row] = cell;
      const dataRow = data[row] || {};
      // dumb but simple way to do this
      const indexes: (keyof GridRow)[] = columnHeaders.map(
        (col) => col.title as GridColumnName
      );
      const d = dataRow[indexes[col]] || "";
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: false,
        displayData: d,
        data: d,
      };
    },
    [data]
  );

  const onCellEdited = useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      if (newValue.kind !== GridCellKind.Text) {
        return;
      }
      const indexes: (keyof GridRow)[] = columnHeaders.map(
        (col) => col.title as GridColumnName
      );
      const [colIdx, rowIdx] = cell;
      const col = indexes[colIdx];
      if (!data[rowIdx]) {
        data[rowIdx] = {};
      }
      data[rowIdx][col] = newValue.data;
      setData([...data]);
    },
    [data]
  );

  return (
    <>
      <Menu>
        <MenuButton as={Button}>Z Stats</MenuButton>
        <MenuList>
          <MenuGroup title="One Sample">
            <OneSampleZSummaryModal />
            <OneSampleZDataModal cols={columns} />
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Two Sample">
            <TwoSampleZSummaryModal />
            <TwoSampleZDataModal cols={columns} />
          </MenuGroup>
        </MenuList>
      </Menu>

      <DescriptiveStatisticsModal cols={columns} />

      <DataEditor
        getCellContent={getContent}
        columns={columnHeaders}
        rows={12}
        onCellEdited={onCellEdited}
        rowMarkers={"clickable-number"}
        getCellsForSelection={true}
        onPaste={true}
      />
      <ul>
        {data.map((row, i) => {
          return (
            <li key={i}>
              {Object.entries(row || {}).map(([k, v]) => `${k}: ${v}`)}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export { App };
