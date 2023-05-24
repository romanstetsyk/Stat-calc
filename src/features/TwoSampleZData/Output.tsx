import * as React from "react";
import { Button } from "@chakra-ui/react";
import { TForm } from "./types";
import { ConfidenceInterval } from "./ConfidenceInterval";
import { HypothesisTest } from "./HypothesisTest";
import { ColumnValues, DisplayOptions, Perform } from "../../Types";

type Props = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
  cols: ColumnValues;
};

export const Output = ({ setDisplay, formSummary, cols }: Props) => {
  const { perform } = formSummary;
  return (
    <>
      <Button onClick={() => setDisplay("form")}>← Back</Button>
      {perform === Perform.HypothesisTest && (
        <HypothesisTest formSummary={formSummary} cols={cols} />
      )}
      {perform === Perform.ConfidenceInerval && (
        <ConfidenceInterval formSummary={formSummary} cols={cols} />
      )}
    </>
  );
};
