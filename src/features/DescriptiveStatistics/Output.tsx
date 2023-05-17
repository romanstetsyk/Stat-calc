import React from "react";
import { Button } from "@chakra-ui/react";

import mean from "@stdlib/stats-base-mean";
import mediansorted from "@stdlib/stats-base-mediansorted";
import variance from "@stdlib/stats-base-variance";
import stdev from "@stdlib/stats-base-stdev";

import { DisplayOptions, TForm } from "./types";
import { ColumnValues, GridColumnName } from "../../Types";
import {
  DataTable,
  SampleStatisticsEnum,
  DataTableRow,
} from "../../components/DataTable";

type Props = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
  cols: ColumnValues;
};

export const Output = ({ setDisplay, formSummary, cols }: Props) => {
  const { columns, options } = formSummary;

  const data: DataTableRow[] = (columns as GridColumnName[]).map((colName) => {
    const arrOfNums = cols[colName].map(Number).filter(Number.isFinite);
    const n = arrOfNums.length;
    const row: DataTableRow = { "": colName };

    // Data length
    if (options.includes(SampleStatisticsEnum.N)) {
      row[SampleStatisticsEnum.N] = n;
    }

    // Mean
    if (options.includes(SampleStatisticsEnum.Xbar)) {
      row[SampleStatisticsEnum.Xbar] = mean(n, arrOfNums, 1);
    }

    // Median
    if (options.includes(SampleStatisticsEnum.Median)) {
      row[SampleStatisticsEnum.Median] = mediansorted(
        n,
        arrOfNums.sort((a, b) => a - b),
        1
      );
    }

    // Sample variance
    if (options.includes(SampleStatisticsEnum.SVariance)) {
      row[SampleStatisticsEnum.SVariance] = variance(n, 1, arrOfNums, 1);
    }

    // Population variance
    if (options.includes(SampleStatisticsEnum.PVariance)) {
      row[SampleStatisticsEnum.PVariance] = variance(n, 0, arrOfNums, 1);
    }

    // Sample standard deviation
    if (options.includes(SampleStatisticsEnum.SStdev)) {
      row[SampleStatisticsEnum.SStdev] = stdev(n, 1, arrOfNums, 1);
    }

    // Population standard deviation
    if (options.includes(SampleStatisticsEnum.PStdev)) {
      row[SampleStatisticsEnum.PStdev] = stdev(n, 0, arrOfNums, 1);
    }

    // Standard error (uses sample stdev)
    if (options.includes(SampleStatisticsEnum.Stderr)) {
      row[SampleStatisticsEnum.Stderr] = stdev(n, 1, arrOfNums, 1) / n ** 0.5;
    }

    return row;
  });

  return (
    <>
      <Button onClick={() => setDisplay("form")}>← Back</Button>
      <DataTable data={data} stats={options} />
    </>
  );
};
