import type { FlexProps } from '@chakra-ui/react';
import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

import { isFiniteNumber, isPositiveNumber } from '~/utils/validators';

import { FieldStack } from './field-stack';
import { InputField } from './input-field';

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  disabled: boolean;
  start: Path<T>;
  startError?: FieldError;
  width: Path<T>;
  widthError?: FieldError;
} & FlexProps;

const BinManual = <T extends FieldValues>({
  register,
  disabled,
  start,
  startError,
  width,
  widthError,
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

      <InputField
        name={width}
        label='Width'
        register={register}
        error={widthError}
        rules={{
          required: {
            value: !disabled,
            message: 'This value is required',
          },
          validate: (value) => disabled || isPositiveNumber(value),
        }}
      />
    </FieldStack>
  );
};

export { BinManual };
