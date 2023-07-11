import { useId, useState } from "react";
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import { SubmitHandler } from "react-hook-form";
import { BinMethod, DisplayOptions } from "~/Types";
import { Output } from "./Output";
import { StatForm } from "./StatForm";
import { FreqDist, TForm } from "./types";

type Props = {
  onClose: () => void;
};

export const Content = ({ onClose }: Props) => {
  const formId = useId();
  const [display, setDisplay] = useState<DisplayOptions>("form");
  const [formSummary, setFormSummary] = useState<TForm>({
    columns: [],
    options: [...FreqDist],
    withLabel: false,
    method: BinMethod.MANUAL,
    manual: {
      width: "",
    },
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
      <ModalHeader>Group Numeric Data</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {display === "form" && (
          <StatForm
            onSubmit={onSubmit}
            formId={formId}
            defaultValues={formSummary}
          />
        )}
        {display === "result" && (
          <Output setDisplay={setDisplay} formSummary={formSummary} />
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
