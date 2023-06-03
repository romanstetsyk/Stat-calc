import { useCallback, useContext } from "react";
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
import { StatModal as FrequencyDistributionModal } from "./features/FrequencyDistribution/StatModal";
import { StatModal as GroupNumericDataModal } from "./features/GroupNumericData/StatModal";
import { StatModal as TwoSampleZSummaryModal } from "./features/TwoSampleZSummary/StatModal";
import { StatModal as TwoSampleZDataModal } from "./features/TwoSampleZData/StatModal";
import { GridColumnName, GridRow } from "./Types";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { DataColumnsContext } from "./contexts/DataColumnsContext";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Session } from "./components/Session";

const columnHeaders: GridColumn[] = Array.from({ length: 5 }, (_, i) => {
  const col: { title: GridColumnName; width: number } = {
    title: `col${i + 1}`,
    width: 100,
  };
  return col;
});

function App() {
  const { rowData, setRowData } = useContext(DataColumnsContext);

  const getContent = useCallback(
    (cell: Item): GridCell => {
      const [col, row] = cell;
      const dataRow = rowData[row] || {};
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
    [rowData]
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
      if (!rowData[rowIdx]) {
        rowData[rowIdx] = {};
      }
      rowData[rowIdx][col] = newValue.data;
      setRowData([...rowData]);
    },
    [rowData, setRowData]
  );

  return (
    <>
      <Menu>
        <MenuButton
          px={4}
          py={2}
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          _hover={{ bg: "gray.400" }}
          _expanded={{ bg: "gray.500" }}
          _focus={{ boxShadow: "outline" }}
        >
          Z Stats <ChevronDownIcon />
        </MenuButton>
        <MenuList>
          <MenuGroup title="One Sample">
            <OneSampleZSummaryModal />
            <OneSampleZDataModal />
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Two Sample">
            <TwoSampleZSummaryModal />
            <TwoSampleZDataModal />
          </MenuGroup>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          px={4}
          py={2}
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          _hover={{ bg: "gray.400" }}
          _expanded={{ bg: "gray.500" }}
          _focus={{ boxShadow: "outline" }}
        >
          Summarize <ChevronDownIcon />
        </MenuButton>
        <MenuList>
          <DescriptiveStatisticsModal />
          <FrequencyDistributionModal />
          <GroupNumericDataModal />
        </MenuList>
      </Menu>

      <DataEditor
        getCellContent={getContent}
        columns={columnHeaders}
        rows={10}
        onCellEdited={onCellEdited}
        rowMarkers={"clickable-number"}
        getCellsForSelection={true}
        onPaste={true}
      />

      <h2>Session</h2>
      <Session />
    </>
  );
}

export { App };
