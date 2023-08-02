import { forwardRef } from "react";
import { BoxProps, RadioGroup } from "@chakra-ui/react";
import { Perform } from "~/Types";

type Props = {
  children: React.ReactNode;
  onChange: (event: Perform | React.ChangeEvent<Element>) => void;
} & Omit<BoxProps, "defaultValue" | "onChange">;

export const RadioGroupPerform = forwardRef(
  ({ children, onChange, ...rest }: Props) => {
    return (
      <RadioGroup
        as="fieldset"
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        gap={4}
        onChange={(value: Perform) => onChange(value)}
        {...rest}
      >
        {children}
      </RadioGroup>
    );
  }
);

RadioGroupPerform.displayName = "RadioGroupPerform";
