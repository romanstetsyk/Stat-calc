import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputProps,
  Select,
  VStack,
} from "@chakra-ui/react";
import {
  DeepMap,
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type Props<TFormValues extends FieldValues> = {
  label?: string;
  name: Path<TFormValues>;
  placeholder: string;
  rules?: RegisterOptions;
  register?: UseFormRegister<TFormValues>;
  errors?: Partial<DeepMap<TFormValues, FieldError>>;
  children: React.ReactNode;
} & Omit<InputProps, "name">;

const SelectField = <TFormValues extends Record<string, unknown>>({
  label,
  name,
  errors,
  register,
  rules,
  children,
  placeholder,
}: Props<TFormValues>) => {
  return (
    <FormControl
      isInvalid={Boolean(errors?.[name])}
      display="flex"
      alignItems="baseline"
      width="auto"
      gap={3}
    >
      {label && (
        <FormLabel whiteSpace={"nowrap"} fontWeight={400} m={0}>
          {label}
        </FormLabel>
      )}
      <VStack alignItems="start" gap={0}>
        <Select
          size="sm"
          placeholder={placeholder}
          {...(register && register(name, rules))}
        >
          {children}
        </Select>
        <FormErrorMessage as="span">
          {errors?.[name]?.type === "required" && errors[name]?.message}
          {errors?.[name]?.type === "validate" &&
            `${label || "This value"} ${errors[name]?.message}`}
        </FormErrorMessage>
      </VStack>
    </FormControl>
  );
};

export { SelectField };
