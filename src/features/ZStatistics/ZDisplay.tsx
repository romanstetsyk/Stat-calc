import { Button } from "@chakra-ui/react";
import { DisplayOptions, TFormSummary } from "./types";

type IProps = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TFormSummary;
};

function ZDisplay({ setDisplay, formSummary }: IProps) {
  const { xbar } = formSummary;
  return (
    <>
      <Button onClick={() => setDisplay("form")}>Edit</Button>
      Mean: {xbar}
    </>
  );
}

export default ZDisplay;
