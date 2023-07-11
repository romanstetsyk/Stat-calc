import * as React from "react";
import { useContext, useEffect, useMemo } from "react";
import { Button, Flex } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { DataColumnsContext } from "~/contexts/DataColumnsContext";
import { DisplayOptions } from "~/Types";
import { calcFrequency } from "./calcFrequency";
import { OutputContent } from "./OutputContent";
import { FreqDistSession, TForm } from "./types";

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
  setOutput: React.Dispatch<React.SetStateAction<FreqDistSession | undefined>>;
};

export const Output = ({ id, setDisplay, formSummary, setOutput }: Props) => {
  const outputId = useMemo(() => (id ? id : nanoid()), [id]);

  const { columnData } = useContext(DataColumnsContext);
  const { columns, options, withLabel } = formSummary;

  const arrOfTables = useMemo(
    () => calcFrequency(columns, columnData, withLabel, options),
    [columnData, columns, options, withLabel]
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
