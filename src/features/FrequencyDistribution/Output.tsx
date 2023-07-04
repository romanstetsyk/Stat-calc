import * as React from "react";
import { useContext, useEffect, useMemo } from "react";
import { Button, Flex } from "@chakra-ui/react";
import gcusum from "@stdlib/blas-ext-base-gcusum";
import tabulate from "@stdlib/utils-tabulate";
import { nanoid } from "nanoid";
import { DataTableRow } from "~/components/DataTable";
import { DataColumnsContext } from "~/contexts/DataColumnsContext";
import { DisplayOptions, GridColumnName } from "~/Types";
import { getVarName, getVarValues } from "~/utils/getColumnNameAndValues";
import { parseNumber } from "~/utils/parseNumber";
import { OutputContent } from "./OutputContent";
import {
  FreqDist,
  FreqDistSession,
  OutputReturn,
  TForm,
  topLeftCell,
} from "./types";

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
  setOutput: React.Dispatch<React.SetStateAction<FreqDistSession | undefined>>;
};

export const Output = ({ id, setDisplay, formSummary, setOutput }: Props) => {
  const { columnData } = useContext(DataColumnsContext);

  const outputId = useMemo(() => (id ? id : nanoid()), [id]);

  const { columns, options, withLabel } = formSummary;

  const arrOfTables: OutputReturn[] = (columns as GridColumnName[]).map(
    (colHeader) => {
      const varName = getVarName(columnData, colHeader, withLabel);
      const varValues = getVarValues(columnData, colHeader, withLabel);
      const n = varValues.length;
      const out = tabulate(varValues);

      const table: DataTableRow<FreqDist, typeof topLeftCell>[] = out.map(
        ([x, fr, relFr]) => {
          const row: DataTableRow<FreqDist, typeof topLeftCell> = {
            Value: x.toString(),
            Frequency: (fr as number).toString(),
            "Relative Frequency": parseNumber(relFr as number),
          };
          return row;
        }
      );

      if (options.includes("Cumulative Frequency")) {
        const freqArr = out.map((e) => e[1]);
        const cumulFreq = Array(freqArr.length);
        gcusum(table.length, 0, freqArr, 1, cumulFreq, 1);
        table.forEach((row, i) => {
          row["Cumulative Frequency"] = cumulFreq[i].toString();
        });
      }

      if (options.includes("Cumulative Relative Frequency")) {
        const relFreqArr = out.map((e) => e[2]);
        const cumulRelFreq = Array(relFreqArr.length);
        gcusum(table.length, 0, relFreqArr, 1, cumulRelFreq, 1);
        table.forEach((row, i) => {
          row["Cumulative Relative Frequency"] = parseNumber(cumulRelFreq[i]);
        });
      }
      const stats: [typeof topLeftCell, ...typeof options] = [
        topLeftCell,
        ...options,
      ];
      return { varName, n, table, stats };
    }
  );

  useEffect(() => {
    setOutput({
      id: outputId,
      timestamp: Date.now(),
      title: "Frequency Distribution",
      type: "frequencyDistribution",
      data: arrOfTables,
      formSummary,
    });
  }, [arrOfTables, formSummary, outputId, setOutput]);

  return (
    <>
      <Button onClick={() => setDisplay("form")}>← Back</Button>

      <Flex gap={4} flexDirection={"column"}>
        <OutputContent outputData={arrOfTables} />
      </Flex>
    </>
  );
};
