import { useContext, useId, useState } from "react";
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import { SubmitHandler } from "react-hook-form";
import { SessionContext } from "~/contexts/SessionContext";
import { BinMethod, DisplayOptions } from "~/Types";
import { Output } from "./Output";
import { StatForm } from "./StatForm";
import { FrequencyDistribution, HistogramSession, TForm } from "./types";

const DEFAULT_SELECTED_FIELDS = {
  columns: [],
  options: FrequencyDistribution[0],
  withLabel: false,
  method: BinMethod.MANUAL,
  manual: {
    start: "",
    width: "",
  },
  squareRoot: {
    start: "",
  },
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
    return sessionItem && sessionItem.type === "histogram"
      ? sessionItem.formSummary
      : DEFAULT_SELECTED_FIELDS;
  });

  const [output, setOutput] = useState<HistogramSession>();

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
      <ModalHeader>Histogram</ModalHeader>
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
