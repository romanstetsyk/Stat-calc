import * as React from "react";
import { Button } from "@chakra-ui/react";
import { DisplayOptions, Perform } from "~/Types";
import { calcCI } from "./calcCI";
import { calcHT } from "./calcHT";
import { OutputContent } from "./OutputContent";
import { CIReturn, HTReturn, TForm } from "./types";

type Props = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
};

export const Output = ({ setDisplay, formSummary }: Props) => {
  const { perform } = formSummary;

  let outputData: CIReturn | HTReturn;
  switch (perform) {
    case Perform.HypothesisTest:
      outputData = calcHT(formSummary);
      break;
    case Perform.ConfidenceInerval:
      outputData = calcCI(formSummary);
      break;
    default:
      throw new Error("Unknown z-test type");
  }

  return (
    <>
      <Button onClick={() => setDisplay("form")}>← Back</Button>
      <OutputContent formSummary={formSummary} outputData={outputData} />
    </>
  );
};
