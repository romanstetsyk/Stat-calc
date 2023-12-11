import { FormControl, FormErrorMessage, RadioGroup } from '@chakra-ui/react';
import type { WithRequired } from '@shared/build/esm/index';
import type { ComponentProps } from 'react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { useController } from '~/common/hooks';

type Props<T extends FieldValues> = WithRequired<
  UseControllerProps<T>,
  'control'
> &
  ComponentProps<typeof RadioGroup> & {
    formControlProps?: ComponentProps<typeof FormControl>;
  };

const RadioGroupControlled = <T extends FieldValues>({
  children,
  control,
  name,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  formControlProps,
  ...radioGroupProps
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
    <FormControl isInvalid={invalid} {...formControlProps}>
      <RadioGroup {...field} {...radioGroupProps}>
        {children}
      </RadioGroup>
      {error && (
        <FormErrorMessage as='span' m={0}>
          {error.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export { RadioGroupControlled };
