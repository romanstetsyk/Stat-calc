import { Checkbox } from '@chakra-ui/react';
import type { WithRequired } from '@shared/build/esm/index';
import type { ComponentProps } from 'react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { useController } from '~/common/hooks';

type Props<T extends FieldValues> = WithRequired<
  UseControllerProps<T>,
  'control'
> &
  ComponentProps<typeof Checkbox>;

const CheckboxControlled = <T extends FieldValues>({
  children,
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  ...inputProps
}: Props<T>): JSX.Element => {
  const {
    field: { value, ...rest },
  } = useController({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
  });

  return (
    <Checkbox isChecked={value} {...rest} {...inputProps}>
      {children}
    </Checkbox>
  );
};

export { CheckboxControlled };
