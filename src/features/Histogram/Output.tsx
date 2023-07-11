import * as React from "react";
import { useContext, useEffect, useMemo } from "react";
import { Button, Flex } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { DataColumnsContext } from "~/contexts/DataColumnsContext";
import { DisplayOptions } from "~/Types";
import { calcHistogram } from "./calcHistogram";
import { OutputContent } from "./OutputContent";
import { HistogramSession, TForm } from "./types";

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
  setOutput: React.Dispatch<React.SetStateAction<HistogramSession | undefined>>;
};

export const Output = ({ id, setDisplay, formSummary, setOutput }: Props) => {
  console.log("hist");
  const outputId = useMemo(() => (id ? id : nanoid()), [id]);

  const { columnData } = useContext(DataColumnsContext);
  const arrOfTables = useMemo(
    () => calcHistogram(columnData, formSummary),
    [columnData, formSummary]
  );

  useEffect(() => {
    setOutput({
      id: outputId,
      timestamp: Date.now(),
      title: "Histogram",
      type: "histogram",
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
