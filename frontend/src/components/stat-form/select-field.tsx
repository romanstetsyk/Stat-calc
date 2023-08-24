import type { InputProps } from '@chakra-ui/react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  VStack,
} from '@chakra-ui/react';
import type {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

type Props<TFormValues extends FieldValues> = {
  label?: string;
  name: Path<TFormValues>;
  placeholder: string;
  rules?: RegisterOptions;
  register?: UseFormRegister<TFormValues>;
  error?: FieldError;
  children: React.ReactNode;
} & Omit<InputProps, 'name'>;

const SelectField = <TFormValues extends Record<string, unknown>>({
  label,
  name,
  error,
  register,
  rules,
  children,
  placeholder,
}: Props<TFormValues>): JSX.Element => {
  return (
    <FormControl
      isInvalid={Boolean(error)}
      display='flex'
      alignItems='baseline'
      width='auto'
      gap={3}
    >
      {label && (
        <FormLabel whiteSpace='nowrap' fontWeight={400} m={0}>
          {label}
        </FormLabel>
      )}
      <VStack alignItems='start' gap={0}>
        <Select
          size='sm'
          placeholder={placeholder}
          {...register?.(name, rules)}
        >
          {children}
        </Select>
        <FormErrorMessage as='span'>
          {error?.type === 'required' && error.message}
          {error?.type === 'validate' &&
            `${label ?? 'This value'} ${error.message}`}
        </FormErrorMessage>
      </VStack>
    </FormControl>
  );
};

export { SelectField };
