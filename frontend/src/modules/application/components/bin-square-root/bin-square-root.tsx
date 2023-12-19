import type { FlexProps } from '@chakra-ui/react';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { FieldStack } from '~/common/components/field-stack';
import { InputField } from '~/common/components/input-field';

type Props<T extends FieldValues> = Pick<
  UseControllerProps<T>,
  'control' | 'disabled'
> & {
  start: Omit<UseControllerProps<T>, 'control'>;
} & FlexProps;

const BinSquareRoot = <T extends FieldValues>({
  control,
  disabled,
  start,
  ...restProps
}: Props<T>): JSX.Element => {
  return (
    <FieldStack
      flexDirection='row'
      disabled={disabled}
      opacity={disabled ? '0.5' : '1'}
      {...restProps}
    >
      <InputField
        label='Start'
        control={control}
        placeholder='optional'
        {...start}
      />
    </FieldStack>
  );
};

export { BinSquareRoot };
