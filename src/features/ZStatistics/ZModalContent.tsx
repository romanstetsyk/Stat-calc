import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import ZForm from "./ZForm";
import { useId, useState } from "react";
import ZDisplay from "./ZDisplay";
import { SubmitHandler } from "react-hook-form";
import { DisplayOptions, PerformType, TFormSummary } from "./types";

interface IProps {
  onClose: () => void;
}

function ZModalContent({ onClose }: IProps) {
  const formId = useId();

  const [display, setDisplay] = useState<DisplayOptions>("form");
  const [formSummary, setFormSummary] = useState<TFormSummary>({
    xbar: "",
    stdev: "",
    n: "",
    perform: PerformType.hypothesisTest,
    mu0dir: "eq",
    mu1dir: "ne",
    mu0val: "0",
    mu1val: "0",
    alpha: "0.05",
    level: "0.95",
  });

  const onSubmit: SubmitHandler<TFormSummary> = (data) => {
    console.log(data);
    setFormSummary(data);
    setDisplay("result");
  };

  return (
    <ModalContent>
      <ModalHeader>One Sample Z Test with Summary</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {display === "form" && (
          <ZForm
            formId={formId}
            onSubmit={onSubmit}
            defaultValues={formSummary}
          />
        )}
        {display === "result" && formSummary && (
          <ZDisplay setDisplay={setDisplay} formSummary={formSummary} />
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

export default ZModalContent;
