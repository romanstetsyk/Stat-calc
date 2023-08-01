import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
  VStack,
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
      alignItems="flex-start"
      width="auto"
      gap={3}
    >
      {label && (
        <FormLabel whiteSpace={"nowrap"} fontWeight={400} m={0}>
          {label}
        </FormLabel>
      )}
      <VStack alignItems="start" gap={0}>
        <Input
          size="xs"
          width="80px"
          {...(register && register(name, rules))}
        />
        <FormErrorMessage as="span" m={0}>
          {error?.type === "required" && error?.message}
          {error?.type === "validate" &&
            `${label || "This value"} ${error?.message}`}
        </FormErrorMessage>
      </VStack>
    </FormControl>
  );
};

export { InputField };
