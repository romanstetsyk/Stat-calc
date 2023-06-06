import { useContext, useId, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { FreqDistSession, TForm } from "./types";
import { FreqDist } from "./types";
import { StatForm } from "./StatForm";
import { DisplayOptions } from "../../Types";
import { Output } from "./Output";
import { SessionContext } from "../../contexts/SessionContext";

type Props = {
  onClose: () => void;
};

export const Content = ({ onClose }: Props) => {
  const { addSessionItem } = useContext(SessionContext);

  const formId = useId();
  const [display, setDisplay] = useState<DisplayOptions>("form");
  const [formSummary, setFormSummary] = useState<TForm>({
    columns: [],
    options: [...FreqDist],
    withLabel: false,
  });

  const [output, setOutput] = useState<FreqDistSession>();

  const onSaveToSession = () => {
    if (output) {
      addSessionItem(output);
    }
    console.log(JSON.stringify(output, null, 2).length);
    onClose();
  };

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
      <ModalHeader>Frequency Distribution</ModalHeader>
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
          <Output
            setDisplay={setDisplay}
            formSummary={formSummary}
            setOutput={setOutput}
          />
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" mr={3} onClick={onClose}>
          Close
        </Button>
        {display === "form" && (
          <Button type="submit" colorScheme="blue" form={formId}>
            Calculate
          </Button>
        )}
        {display === "result" && (
          <Button colorScheme="blue" onClick={onSaveToSession}>
            Save and Close
          </Button>
        )}
      </ModalFooter>
    </ModalContent>
  );
};
