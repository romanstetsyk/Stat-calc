import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { DisplayOptions, Options, TForm } from "./types";
import { useId, useState } from "react";
import { StatForm } from "./StatForm";
import { SubmitHandler } from "react-hook-form";
import { ColumnValues } from "../../Types";
import { Output } from "./Output";

interface IProps {
  onClose: () => void;
  cols: ColumnValues;
}

function Content({ cols, onClose }: IProps) {
  const formId = useId();
  const [display, setDisplay] = useState<DisplayOptions>("form");
  const [formSummary, setFormSummary] = useState<TForm>({
    columns: [],
    options: Object.values(Options),
  });

  const onSubmit: SubmitHandler<TForm> = (data) => {
    const { columns, options } = data;
    console.log(options);
    if (columns === false || columns.length === 0) return;
    if (typeof columns === "string") {
      setFormSummary({ columns: [columns], options: options });
    } else {
      setFormSummary({ columns, options });
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
}

export { Content };
