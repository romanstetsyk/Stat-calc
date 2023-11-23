import { Input } from '@chakra-ui/react';
import type { ComponentProps, HTMLInputTypeAttribute } from 'react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { useController } from '~/common/hooks';

type InputType = Extract<HTMLInputTypeAttribute, 'text' | 'email' | 'password'>;

type Props<T extends FieldValues> = UseControllerProps<T> &
  ComponentProps<typeof Input> & { 'type': InputType };

const InputControlled = <T extends FieldValues>({
  type = 'text',
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  ...inputProps
}: Props<T>): JSX.Element => {
  const { field } = useController({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
  });

  return <Input type={type} {...field} {...inputProps} />;
};

export { InputControlled };
