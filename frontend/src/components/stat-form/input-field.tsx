import type { InputProps } from '@chakra-ui/react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import type {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

type Props<T extends FieldValues> = {
  label?: string;
  placeholder?: string;
  name: Path<T>;
  rules?: RegisterOptions;
  register?: UseFormRegister<T>;
  error?: FieldError;
} & Omit<InputProps, 'name'>;

const InputField = <T extends Record<string, unknown>>({
  label,
  name,
  error,
  register,
  rules,
  placeholder,
}: Props<T>): JSX.Element => {
  return (
    <FormControl
      isInvalid={Boolean(error)}
      display='flex'
      alignItems='flex-start'
      width='auto'
      gap={3}
    >
      {label && (
        <FormLabel whiteSpace='nowrap' fontWeight={400} m={0}>
          {label}
        </FormLabel>
      )}
      <VStack alignItems='start' gap={0}>
        <Input
          size='xs'
          width='80px'
          placeholder={placeholder}
          {...register?.(name, rules)}
        />
        <FormErrorMessage as='span' m={0}>
          {error?.type === 'required' && error.message}
          {error?.type === 'validate' &&
            `${label ?? 'This value'} ${error.message}`}
        </FormErrorMessage>
      </VStack>
    </FormControl>
  );
};

export { InputField };
