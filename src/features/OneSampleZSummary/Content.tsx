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
import { DisplayOptions, Perform } from "~/Types";
import { Output } from "./Output";
import { StatForm } from "./StatForm";
import { TForm, Z1SummarySession } from "./types";

const DEFAULT_SELECTED_FIELDS: TForm = {
  xbar: "",
  stdev: "",
  n: "",
  perform: Perform.HypothesisTest,
  alternative: "notEqual",
  nullValue: "0",
  alpha: "0.05",
  level: "0.95",
  optional: {
    confidenceInterval: false,
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
    return sessionItem && sessionItem.type === "z1summary"
      ? sessionItem.formSummary
      : DEFAULT_SELECTED_FIELDS;
  });

  const [output, setOutput] = useState<Z1SummarySession>();

  const onSaveToSession = () => {
    if (output) {
      id ? updateSessionItem(output) : addSessionItem(output);
    }
    onClose();
  };

  const onSubmit: SubmitHandler<TForm> = (data) => {
    console.log(data);
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
          />
        )}
        {display === "result" && formSummary && (
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
