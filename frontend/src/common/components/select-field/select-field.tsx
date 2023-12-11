import type { FormControlProps, SelectProps } from '@chakra-ui/react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Portal,
  Select,
} from '@chakra-ui/react';
import type { ComponentProps, RefObject } from 'react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { useController } from '~/common/hooks';

const COL_2 = 2;

type Props<T extends FieldValues> = UseControllerProps<T> &
  SelectProps &
  ComponentProps<'select'> & {
    label?: string;
    errorContainerRef?: RefObject<HTMLElement>;
    formControlProps?: FormControlProps;
  };

const SelectField = <T extends FieldValues>({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  label,
  children,
  errorContainerRef,
  formControlProps,
  ...selectProps
}: Props<T>): JSX.Element => {
  const {
    field,
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

      <Select {...field} {...selectProps}>
        {children}
      </Select>

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

export { SelectField };
