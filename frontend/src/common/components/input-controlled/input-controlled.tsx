import { Input } from '@chakra-ui/react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { useController } from '~/common/hooks';

type InputType = 'text' | 'email' | 'password';

type Props<T extends FieldValues> = UseControllerProps<T> & {
  type: InputType;
};

const InputControlled = <T extends FieldValues>({
  name,
  type = 'text',
  control,
}: Props<T>): JSX.Element => {
  const { field } = useController({ name, control });

  return <Input type={type} {...field} />;
};

export { InputControlled };
