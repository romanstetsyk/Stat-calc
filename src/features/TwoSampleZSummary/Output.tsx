import * as React from "react";
import { useEffect, useMemo } from "react";
import { Button } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { DisplayOptions, Perform } from "~/Types";
import { calcCI } from "./calcCI";
import { calcHT } from "./calcHT";
import { OutputContent } from "./OutputContent";
import { CIReturn, HTReturn, TForm, Z2SummarySession } from "./types";

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
  setOutput: React.Dispatch<React.SetStateAction<Z2SummarySession | undefined>>;
};

export const Output = ({ id, setDisplay, formSummary, setOutput }: Props) => {
  const outputId = useMemo(() => (id ? id : nanoid()), [id]);

  const { perform } = formSummary;

  const outputData: CIReturn | HTReturn = useMemo(() => {
    let result;
    switch (perform) {
      case Perform.HypothesisTest:
        result = calcHT(formSummary);
        break;
      case Perform.ConfidenceInerval:
        result = calcCI(formSummary);
        break;
      default:
        throw new Error("Unknown z-test type");
    }
    return result;
  }, [formSummary, perform]);

  useEffect(() => {
    setOutput({
      id: outputId,
      timestamp: Date.now(),
      title: "Two Sample Z",
      type: "z2summary",
      data: outputData,
      formSummary,
    });
  }, [formSummary, outputData, outputId, setOutput]);

  return (
    <>
      <Button onClick={() => setDisplay("form")}>← Back</Button>
      <OutputContent formSummary={formSummary} outputData={outputData} />
    </>
  );
};
