import {
  FormControl,
  FormLabel,
  VStack,
  FormErrorMessage,
  Input,
  InputProps,
} from "@chakra-ui/react";

import {
  DeepMap,
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

export type IProps<TFormValues extends FieldValues> = {
  label?: string;
  name: Path<TFormValues>;
  rules?: RegisterOptions;
  register?: UseFormRegister<TFormValues>;
  errors?: Partial<DeepMap<TFormValues, FieldError>>;
} & Omit<InputProps, "name">;

const InputField = <TFormValues extends Record<string, unknown>>({
  label,
  name,
  errors,
  register,
  rules,
}: IProps<TFormValues>) => {
  return (
    <FormControl
      isInvalid={Boolean(errors?.[name])}
      display="flex"
      alignItems="baseline"
      width="auto"
    >
      {label && <FormLabel>{label}</FormLabel>}
      <VStack alignItems="start">
        <Input
          size="sm"
          width="80px"
          {...(register && register(name, rules))}
        />
        <FormErrorMessage as="span">
          {errors?.[name]?.type === "required" && errors[name]?.message}
          {errors?.[name]?.type === "validate" &&
            `${label || "This value"} ${errors[name]?.message}`}
        </FormErrorMessage>
      </VStack>
    </FormControl>
  );
};

export default InputField;
