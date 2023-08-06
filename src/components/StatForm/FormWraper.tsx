import { FormEventHandler } from "react";
import { Flex } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
  formId: string;
  onSubmit: FormEventHandler<HTMLDivElement>;
};

export const FormWraper = ({ children, formId, onSubmit }: Props) => {
  return (
    <Flex
      as="form"
      onSubmit={onSubmit}
      id={formId}
      direction={"column"}
      gap={6}
    >
      {children}
    </Flex>
  );
};
