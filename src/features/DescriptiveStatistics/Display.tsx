import { Button } from "@chakra-ui/react";
import { DisplayOptions, TFormSummary } from "./types";
import { ColumnValues } from "../../App";

type IProps = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TFormSummary;
  cols: ColumnValues;
};

function Display({ setDisplay, formSummary, cols }: IProps) {
  const { columns } = formSummary;
  return (
    <>
      <Button onClick={() => setDisplay("form")}>Edit</Button>
      {Array.isArray(columns) && columns.map((col) => <p key={col}>{col}</p>)}
    </>
  );
}

export default Display;
