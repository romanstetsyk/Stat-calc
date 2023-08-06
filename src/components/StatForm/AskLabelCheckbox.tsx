import { forwardRef } from "react";
import { Checkbox, CheckboxProps } from "@chakra-ui/react";
import { ControllerRenderProps } from "react-hook-form";

type Props = ControllerRenderProps & Omit<CheckboxProps, "value">;

export const AskLabelCheckbox = forwardRef((props: Props, ref) => {
  return (
    <Checkbox
      pl={2}
      display="flex"
      isChecked={props.value}
      {...props}
      ref={ref}
    >
      Labels in first row
    </Checkbox>
  );
});

AskLabelCheckbox.displayName = "AskLabelCheckbox";
