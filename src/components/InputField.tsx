import {
  FormControl,
  FormLabel,
  VStack,
  FormErrorMessage,
  Input,
  InputProps,
} from "@chakra-ui/react";
import {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type Props<TFormValues extends FieldValues> = {
  label?: string;
  name: Path<TFormValues>;
  rules?: RegisterOptions;
  register?: UseFormRegister<TFormValues>;
  error?: FieldError;
} & Omit<InputProps, "name">;

const InputField = <TFormValues extends Record<string, unknown>>({
  label,
  name,
  error,
  register,
  rules,
}: Props<TFormValues>) => {
  return (
    <FormControl
      isInvalid={Boolean(error)}
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
          {error?.type === "required" && error?.message}
          {error?.type === "validate" &&
            `${label || "This value"} ${error?.message}`}
        </FormErrorMessage>
      </VStack>
    </FormControl>
  );
};

export { InputField };
