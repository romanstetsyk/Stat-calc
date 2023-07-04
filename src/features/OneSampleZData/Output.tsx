import * as React from "react";
import { Button } from "@chakra-ui/react";
import { DisplayOptions, Perform } from "~/Types";
import { ConfidenceInterval } from "./ConfidenceInterval";
import { HypothesisTest } from "./HypothesisTest";
import { TForm } from "./types";

type Props = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
};

export const Output = ({ setDisplay, formSummary }: Props) => {
  const { perform } = formSummary;
  return (
    <>
      <Button onClick={() => setDisplay("form")}>← Back</Button>
      {perform === Perform.HypothesisTest && (
        <HypothesisTest formSummary={formSummary} />
      )}
      {perform === Perform.ConfidenceInerval && (
        <ConfidenceInterval formSummary={formSummary} />
      )}
    </>
  );
};
