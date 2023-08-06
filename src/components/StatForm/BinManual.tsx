import { FlexProps } from "@chakra-ui/react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { isFiniteNumber, isPositiveNumber } from "~/utils/validators";
import { FieldStack } from "./FieldStack";
import { InputField } from "./InputField";

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  disabled: boolean;
  start: Path<T>;
  startError?: FieldError;
  width: Path<T>;
  widthError?: FieldError;
} & FlexProps;

export const BinManual = <T extends FieldValues>({
  register,
  disabled,
  start,
  startError,
  width,
  widthError,
  ...restProps
}: Props<T>) => {
  return (
    <FieldStack
      flexDirection="row"
      disabled={disabled}
      opacity={disabled ? "0.5" : "1"}
      {...restProps}
    >
      <InputField
        name={start}
        placeholder="optional"
        label="Start"
        register={register}
        error={startError}
        rules={{
          validate: (value) =>
            disabled || value === "" || isFiniteNumber(value),
        }}
      />

      <InputField
        name={width}
        label="Width"
        register={register}
        error={widthError}
        rules={{
          required: {
            value: !disabled,
            message: "This value is required",
          },
          validate: (value) => disabled || isPositiveNumber(value),
        }}
      />
    </FieldStack>
  );
};
