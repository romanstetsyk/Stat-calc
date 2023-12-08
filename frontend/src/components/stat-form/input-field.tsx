import type { FormControlProps, InputProps } from '@chakra-ui/react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Portal,
} from '@chakra-ui/react';
import type { ComponentProps, HTMLInputTypeAttribute, RefObject } from 'react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { useController } from '~/common/hooks';

const COL_2 = 2;

type InputType = Extract<HTMLInputTypeAttribute, 'text' | 'email' | 'password'>;

type Props<T extends FieldValues> = UseControllerProps<T> &
  InputProps &
  ComponentProps<'input'> & {
    type?: InputType;
    label?: string;
    errorContainerRef?: RefObject<HTMLElement>;
    formControlProps?: FormControlProps;
  };

const InputField = <T extends FieldValues>({
  type = 'text',
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  label,
  errorContainerRef,
  formControlProps,
  ...inputProps
}: Props<T>): JSX.Element => {
  const {
    field: { value, ...fieldRest },
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
  });

  return (
    <FormControl
      isInvalid={invalid}
      display='inline-grid'
      gridTemplateColumns={label ? 'auto 1fr' : 'none'}
      alignItems='baseline'
      width='auto'
      gridColumnGap={3}
      gridRowGap={0}
      {...formControlProps}
    >
      {label && (
        <FormLabel whiteSpace='nowrap' fontWeight={400} m={0}>
          {label}
        </FormLabel>
      )}

      <Input type={type} value={value ?? ''} {...fieldRest} {...inputProps} />

      {error &&
        (errorContainerRef ? (
          <Portal containerRef={errorContainerRef}>
            <FormErrorMessage as='span' m={0}>
              {error.message}
            </FormErrorMessage>
          </Portal>
        ) : (
          <FormErrorMessage as='span' m={0} gridColumn={label && COL_2}>
            {error.message}
          </FormErrorMessage>
        ))}
    </FormControl>
  );
};

export { InputField };
