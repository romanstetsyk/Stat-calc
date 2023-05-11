import DataEditor, {
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import { useCallback, useMemo } from "react";

// Set order of table columns here
enum ConfidenceIntervalEnum {
  Level = "Level",
  Zcrit = "Z-crit",
  Me = "M.E.",
  LL = "L. Limit",
  UL = "U. Limit",
}

type ConfidenceIntervalTableRow = {
  [key in ConfidenceIntervalEnum]: number;
};

interface IProps {
  level: number;
  zcrit: number;
  me: number;
  ll: number;
  ul: number;
}

function ConfidenceIntervalTable({ level, zcrit, me, ll, ul }: IProps) {
  const confidenceIntervalColumnHeaders: (GridColumn & {
    title: ConfidenceIntervalEnum;
  })[] = useMemo(() => {
    return Object.values(ConfidenceIntervalEnum).map((e) => ({
      title: e,
      id: e,
    }));
  }, []);

  const confidenceIntervalData: ConfidenceIntervalTableRow[] = [
    {
      [ConfidenceIntervalEnum.Level]: level,
      [ConfidenceIntervalEnum.Zcrit]: zcrit,
      [ConfidenceIntervalEnum.Me]: me,
      [ConfidenceIntervalEnum.LL]: ll,
      [ConfidenceIntervalEnum.UL]: ul,
    },
  ];

  const getConfidenceIntervalContent = useCallback((cell: Item): GridCell => {
    const [col, row] = cell;
    const dataRow = confidenceIntervalData[row];
    // dumb but simple way to do this
    const indexes: (keyof ConfidenceIntervalTableRow)[] =
      confidenceIntervalColumnHeaders.map(
        (col) => col.title as keyof ConfidenceIntervalTableRow
      );
    const d = dataRow[indexes[col]];
    return {
      kind: GridCellKind.Number,
      allowOverlay: true,
      readonly: false,
      displayData: String(d),
      data: d,
    };
  }, []);

  return (
    <>
      <p>Confidence Interval</p>
      <DataEditor
        getCellContent={getConfidenceIntervalContent}
        columns={confidenceIntervalColumnHeaders}
        rows={1}
        getCellsForSelection={true}
        rowMarkers="none"
        copyHeaders={true}
        smoothScrollX={true}
      />
    </>
  );
}

export { ConfidenceIntervalTable };
