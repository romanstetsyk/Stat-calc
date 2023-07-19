import * as React from "react";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { Button, Flex } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { dataStore } from "~/dataStore";
import { DisplayOptions } from "~/Types";
import { calcGroups } from "./calcGroups";
import { OutputContent } from "./OutputContent";
import { GroupNumericalDataSession, TForm } from "./types";

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
  setOutput: React.Dispatch<
    React.SetStateAction<GroupNumericalDataSession | undefined>
  >;
};

export const Output = ({ id, setDisplay, formSummary, setOutput }: Props) => {
  const outputId = useMemo(() => (id ? id : nanoid()), [id]);

  const { colData } = useSyncExternalStore(
    dataStore.subscribe,
    dataStore.getSnapshot
  );
  const arrOfTables = useMemo(
    () => calcGroups(colData, formSummary),
    [colData, formSummary]
  );

  useEffect(() => {
    setOutput({
      id: outputId,
      timestamp: Date.now(),
      title: "Grouped Data",
      type: "groupNumericalData",
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
