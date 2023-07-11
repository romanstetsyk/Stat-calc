import * as React from "react";
import { useContext } from "react";
import { Button } from "@chakra-ui/react";
import { Histogram } from "~/components/Histogram";
import { DataColumnsContext } from "~/contexts/DataColumnsContext";
import { DisplayOptions } from "~/Types";
import { calcHistogram } from "./calcHistogram";
import { TForm } from "./types";

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
};

export const Output = ({ setDisplay, formSummary }: Props) => {
  console.log("hist");
  // const outputId = useMemo(() => (id ? id : nanoid()), [id]);

  const { columnData } = useContext(DataColumnsContext);
  const arrOfTables = calcHistogram(columnData, formSummary);
  const { options } = formSummary;

  return (
    <>
      <Button onClick={() => setDisplay("form")}>← Back</Button>
      {arrOfTables.map(({ varName, out }) => (
        <Histogram
          key={varName}
          domain={out.domain}
          classWidth={out.width}
          table={out.bins}
          parsing={{
            xAxisKey: "midpoint",
            yAxisKey: options,
          }}
          datalabel={varName}
        />
      ))}
    </>
  );
};
