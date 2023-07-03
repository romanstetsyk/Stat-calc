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
import { DescriptiveStatisticsSession, TForm } from "./types";
import { SampleStatistics } from "./types";
import { StatForm } from "./StatForm";
import { DisplayOptions } from "../../Types";
import { Output } from "./Output";
import { SessionContext } from "../../contexts/SessionContext";

const DEFAULT_SELECTED_FIELDS = {
  columns: [],
  options: [...SampleStatistics],
  withLabel: false,
};

type Props = {
  id?: string;
  onClose: () => void;
};

export const Content = ({ onClose, id }: Props) => {
  const { session, addSessionItem, updateSessionItem } =
    useContext(SessionContext);

  const formId = useId();
  const [display, setDisplay] = useState<DisplayOptions>("form");
  const [formSummary, setFormSummary] = useState<TForm>(() => {
    const sessionItem = session.find((item) => item.id === id);
    return sessionItem && sessionItem.type === "descriptive"
      ? sessionItem.formSummary
      : DEFAULT_SELECTED_FIELDS;
  });

  const [output, setOutput] = useState<DescriptiveStatisticsSession>();

  const onSaveToSession = () => {
    if (output) {
      id ? updateSessionItem(output) : addSessionItem(output);
    }
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
      <ModalHeader>Descriptive Stats</ModalHeader>
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
            id={id}
            setDisplay={setDisplay}
            setOutput={setOutput}
            formSummary={formSummary}
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
