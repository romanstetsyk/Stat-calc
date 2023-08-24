import type { FlexProps } from '@chakra-ui/react';
import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

import { isFiniteNumber } from '~/utils/validators';

import { FieldStack } from './field-stack';
import { InputField } from './input-field';

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  disabled: boolean;
  start: Path<T>;
  startError?: FieldError;
} & FlexProps;

const BinSquareRoot = <T extends FieldValues>({
  register,
  disabled,
  start,
  startError,
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
        name={start}
        placeholder='optional'
        label='Start'
        register={register}
        error={startError}
        rules={{
          validate: (value) =>
            disabled || value === '' || isFiniteNumber(value),
        }}
      />
    </FieldStack>
  );
};

export { BinSquareRoot };
