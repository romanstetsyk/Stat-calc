import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { DisplayOptions, TFormSummary } from "./types";
import { useId, useState } from "react";
import DescriptiveForm from "./DescriptiveForm";
import { SubmitHandler } from "react-hook-form";
import { ColumnValues } from "../../App";
import Display from "./Display";

interface IProps {
  onClose: () => void;
  cols: ColumnValues;
}

function DescriptiveModalContent({ cols, onClose }: IProps) {
  const formId = useId();
  const [display, setDisplay] = useState<DisplayOptions>("form");
  const [formSummary, setFormSummary] = useState<TFormSummary>({ columns: [] });

  const onSubmit: SubmitHandler<TFormSummary> = (data) => {
    const { columns } = data;
    if (columns === false || columns.length === 0) return;
    if (typeof columns === "string") {
      setFormSummary({ columns: [columns] });
    } else {
      setFormSummary({ columns });
    }
    setDisplay("result");
    console.log(data);
  };

  return (
    <ModalContent>
      <ModalHeader>Descriptive Stats</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {display === "form" && (
          <DescriptiveForm
            onSubmit={onSubmit}
            cols={cols}
            formId={formId}
            defaultValues={formSummary}
          />
        )}
        {display === "result" && (
          <Display
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
}

export default DescriptiveModalContent;
