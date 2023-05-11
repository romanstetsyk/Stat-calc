import DataEditor, {
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import { useCallback, useMemo } from "react";

// Set order of table columns here
enum HypothesisTestEnum {
  Alpha = "Alpha",
  Zcrit = "Z-crit",
  ZStat = "Z-stat",
  PValue = "P-value",
}

type HypothesisTestTableRow = {
  [key in HypothesisTestEnum]: number;
};

interface IProps {
  zcrit: number;
  zstat: number;
  pvalue: number;
  alpha: number;
}

function HypothesisTestTable({ zcrit, zstat, pvalue, alpha }: IProps) {
  const hypothesisTestColumnHeaders: (GridColumn & {
    title: HypothesisTestEnum;
  })[] = useMemo(() => {
    return Object.values(HypothesisTestEnum).map((e) => ({
      title: e,
      id: e,
    }));
  }, []);

  const hypothesisTestData: HypothesisTestTableRow[] = [
    {
      [HypothesisTestEnum.Zcrit]: zcrit,
      [HypothesisTestEnum.ZStat]: zstat,
      [HypothesisTestEnum.PValue]: pvalue,
      [HypothesisTestEnum.Alpha]: alpha,
    },
  ];

  const getHypothesisTestContent = useCallback((cell: Item): GridCell => {
    const [col, row] = cell;
    const dataRow = hypothesisTestData[row];
    const indexes: (keyof HypothesisTestTableRow)[] =
      hypothesisTestColumnHeaders.map(
        (col) => col.title as keyof HypothesisTestTableRow
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
      <p>Results of Hypothesis Test</p>
      <DataEditor
        getCellContent={getHypothesisTestContent}
        columns={hypothesisTestColumnHeaders}
        rows={1}
        getCellsForSelection={true}
        rowMarkers="none"
        copyHeaders={true}
        smoothScrollX={true}
      />
    </>
  );
}

export { HypothesisTestTable };
