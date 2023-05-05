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
import { DisplayOptions, PerformType, TForm } from "./types";

interface IProps {
  onClose: () => void;
}

function Content({ onClose }: IProps) {
  const formId = useId();

  const [display, setDisplay] = useState<DisplayOptions>("form");
  const [formSummary, setFormSummary] = useState<TForm>({
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

  const onSubmit: SubmitHandler<TForm> = (data) => {
    console.log(data);
    setFormSummary(data);
    setDisplay("result");
  };

  return (
    <ModalContent>
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
}

export { Content };
