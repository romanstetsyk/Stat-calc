import * as React from "react";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { Button } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { DataTable } from "~/components/DataTable";
import { dataStore } from "~/dataStore";
import { DisplayOptions } from "~/Types";
import { calcStatistics } from "./calcStatistics";
import { DescriptiveStatisticsSession, SampleStatistics, TForm } from "./types";

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  setOutput: React.Dispatch<
    React.SetStateAction<DescriptiveStatisticsSession | undefined>
  >;
  formSummary: TForm;
};

export const Output = ({ id, setDisplay, setOutput, formSummary }: Props) => {
  const outputId = useMemo(() => (id ? id : nanoid()), [id]);

  // const { columnData } = useContext(DataColumnsContext);
  const { columnData } = useSyncExternalStore(
    dataStore.subscribe,
    dataStore.getSnapshot
  );
  const { columns, options, withLabel } = formSummary;

  const data = useMemo(
    () => calcStatistics(columns, columnData, withLabel, options),
    [columnData, columns, options, withLabel]
  );

  useEffect(() => {
    setOutput({
      id: outputId,
      timestamp: Date.now(),
      title: "Descriptive Statistics",
      type: "descriptive",
      data,
      stats: ["", ...options],
      formSummary,
    });
  }, [data, formSummary, options, outputId, setOutput]);

  return (
    <>
      <Button onClick={() => setDisplay("form")}>← Back</Button>
      <DataTable<SampleStatistics, ""> data={data} stats={["", ...options]} />
    </>
  );
};
