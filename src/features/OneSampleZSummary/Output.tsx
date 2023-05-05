import * as React from "react";
import { Button } from "@chakra-ui/react";
import { DisplayOptions, PerformType, TForm } from "./types";
import { ConfidenceInterval } from "./ConfidenceInterval";
import { HypothesisTest } from "./HypothesisTest";

type IProps = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
};

function Output({ setDisplay, formSummary }: IProps) {
  const { perform } = formSummary;
  return (
    <>
      <Button onClick={() => setDisplay("form")}>Edit</Button>
      {perform === PerformType.hypothesisTest && (
        <HypothesisTest formSummary={formSummary} />
      )}
      {perform === PerformType.confidenceInterval && (
        <ConfidenceInterval formSummary={formSummary} />
      )}
    </>
  );
}

export { Output };
