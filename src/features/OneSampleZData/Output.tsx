import * as React from "react";
import { Button } from "@chakra-ui/react";
import { DisplayOptions, PerformType, TForm } from "./types";
import { ConfidenceInterval } from "./ConfidenceInterval";
import { HypothesisTest } from "./HypothesisTest";
import { ColumnValues } from "../../Types";

type Props = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
  cols: ColumnValues;
};

export const Output = ({ setDisplay, formSummary, cols }: Props) => {
  const { perform } = formSummary;
  return (
    <>
      <Button onClick={() => setDisplay("form")}>Edit</Button>
      {perform === PerformType.hypothesisTest && (
        <HypothesisTest formSummary={formSummary} cols={cols} />
      )}
      {perform === PerformType.confidenceInterval && (
        <ConfidenceInterval formSummary={formSummary} cols={cols} />
      )}
    </>
  );
};
