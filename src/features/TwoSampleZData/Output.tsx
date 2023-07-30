import * as React from "react";
import { useMemo, useSyncExternalStore } from "react";
import { Button } from "@chakra-ui/react";
import { dataStore } from "~/dataStore";
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
  const { colData } = useSyncExternalStore(
    dataStore.subscribe,
    dataStore.getSnapshot
  );

  const { perform } = formSummary;

  const outputData: CIReturn | HTReturn = useMemo(() => {
    let result;
    switch (perform) {
      case Perform.HypothesisTest:
        result = calcHT(formSummary, colData);
        break;
      case Perform.ConfidenceInerval:
        result = calcCI(formSummary, colData);
        break;
      default:
        throw new Error("Unknown z-test type");
    }
    return result;
  }, [colData, formSummary, perform]);

  return (
    <>
      <Button onClick={() => setDisplay("form")}>← Back</Button>
      <OutputContent formSummary={formSummary} outputData={outputData} />
    </>
  );
};
