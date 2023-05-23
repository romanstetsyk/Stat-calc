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
import { DisplayOptions, TForm } from "./types";
import { FreqDist } from "./types";
import { StatForm } from "./StatForm";
import { ColumnValues } from "../../Types";
import { Output } from "./Output";

type Props = {
  onClose: () => void;
  cols: ColumnValues;
};

export const Content = ({ cols, onClose }: Props) => {
  const formId = useId();
  const [display, setDisplay] = useState<DisplayOptions>("form");
  const [formSummary, setFormSummary] = useState<TForm>({
    columns: [],
    options: [...FreqDist],
  });

  const onSubmit: SubmitHandler<TForm> = (data) => {
    const { columns, options } = data;
    if (columns === false || columns.length === 0) return;
    if (typeof columns === "string") {
      setFormSummary({ columns: [columns], options });
    } else {
      setFormSummary({ columns, options });
    }
    setDisplay("result");
  };

  return (
    <ModalContent>
      <ModalHeader>Frequency Distribution</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {display === "form" && (
          <StatForm
            onSubmit={onSubmit}
            cols={cols}
            formId={formId}
            defaultValues={formSummary}
          />
        )}
        {display === "result" && (
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
