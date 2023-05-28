import { useId, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { StatForm } from "./StatForm";
import { Output } from "./Output";
import { TForm } from "./types";
import { ColumnValues, DisplayOptions, Perform } from "../../Types";

type Props = {
  onClose: () => void;
  cols: ColumnValues;
};

export const Content = ({ onClose, cols }: Props) => {
  const formId = useId();

  const [display, setDisplay] = useState<DisplayOptions>("form");
  const [formSummary, setFormSummary] = useState<TForm>({
    columns: [],
    withLabel: false,
    perform: Perform.HypothesisTest,
    alternative: "notEqual",
    nullValue: "0",
    alpha: "0.05",
    level: "0.95",
  });

  const onSubmit: SubmitHandler<TForm> = (data) => {
    console.log(data);
    const { columns } = data;
    if (columns.length === 0) return;
    setFormSummary(data);
    setDisplay("result");
  };

  return (
    <ModalContent
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
    >
      <ModalHeader>One Sample Z Test</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {display === "form" && (
          <StatForm
            formId={formId}
            onSubmit={onSubmit}
            defaultValues={formSummary}
            cols={cols}
          />
        )}
        {display === "result" && formSummary && (
          <Output
            setDisplay={setDisplay}
            formSummary={formSummary}
            cols={cols}
          />
        )}
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={onClose}>
          Close
        </Button>
        {display === "form" && (
          <Button type="submit" variant="ghost" form={formId}>
            Calculate
          </Button>
        )}
      </ModalFooter>
    </ModalContent>
  );
};
