import * as React from "react";
import { Button } from "@chakra-ui/react";
import { DisplayOptions, PerformType, TForm } from "./types";
import { ConfidenceInterval } from "./ConfidenceInterval";
import { HypothesisTest } from "./HypothesisTest";

type Props = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
};

export const Output = ({ setDisplay, formSummary }: Props) => {
  const { perform } = formSummary;
  return (
    <>
      <Button onClick={() => setDisplay("form")}>← Back</Button>
      {perform === PerformType.hypothesisTest && (
        <HypothesisTest formSummary={formSummary} />
      )}
      {perform === PerformType.confidenceInterval && (
        <ConfidenceInterval formSummary={formSummary} />
      )}
    </>
  );
};
