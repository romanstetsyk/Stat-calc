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

type Props<T extends FieldValues> = {
  label?: string;
  name: Path<T>;
  rules?: RegisterOptions;
  register?: UseFormRegister<T>;
  error?: FieldError;
} & Omit<InputProps, "name">;

const InputField = <T extends Record<string, unknown>>({
  label,
  name,
  error,
  register,
  rules,
}: Props<T>) => {
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
