import type { FlexProps } from '@chakra-ui/react';
import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

import { isValidLevel } from '~/utils/validators';

import { FieldStack } from './field-stack';
import { InputField } from './input-field';

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  disabled: boolean;
  level: Path<T>;
  levelError?: FieldError;
} & FlexProps;

const CIFormPart = <T extends FieldValues>({
  disabled,
  register,
  level,
  levelError,
  ...restProps
}: Props<T>): JSX.Element => {
  return (
    <FieldStack
      disabled={disabled}
      opacity={disabled ? '0.5' : '1'}
      {...restProps}
    >
      <InputField
        label='Level'
        name={level}
        register={register}
        rules={{
          required: {
            value: !disabled,
            message: 'This value is required',
          },
          validate: (value) => disabled || isValidLevel(value),
        }}
        error={levelError}
      />
    </FieldStack>
  );
};

export { CIFormPart };
