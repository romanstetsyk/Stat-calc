import type { FlexProps } from '@chakra-ui/react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { FieldStack } from './field-stack';
import { InputField } from './input-field';

type Props<T extends FieldValues> = Pick<
  UseControllerProps<T>,
  'control' | 'disabled'
> & {
  level: Omit<UseControllerProps<T>, 'control'>;
} & FlexProps;

const CIFormPart = <T extends FieldValues>({
  control,
  disabled,
  level,
  ...flexProps
}: Props<T>): JSX.Element => {
  return (
    <FieldStack
      disabled={disabled}
      opacity={disabled ? '0.5' : '1'}
      {...flexProps}
    >
      <InputField label='Level:' control={control} {...level} />
    </FieldStack>
  );
};

export { CIFormPart };
