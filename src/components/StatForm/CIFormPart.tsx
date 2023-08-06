import { FlexProps } from "@chakra-ui/react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { isValidLevel } from "~/utils/validators";
import { FieldStack } from "./FieldStack";
import { InputField } from "./InputField";

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  disabled: boolean;
  level: Path<T>;
  levelError?: FieldError;
} & FlexProps;

export const CIFormPart = <T extends FieldValues>({
  disabled,
  register,
  level,
  levelError,
  ...restProps
}: Props<T>) => {
  return (
    <FieldStack
      disabled={disabled}
      opacity={disabled ? "0.5" : "1"}
      {...restProps}
    >
      <InputField
        label="Level"
        name={level}
        register={register}
        rules={{
          required: {
            value: !disabled,
            message: "This value is required",
          },
          validate: (value) => disabled || isValidLevel(value),
        }}
        error={levelError}
      />
    </FieldStack>
  );
};
