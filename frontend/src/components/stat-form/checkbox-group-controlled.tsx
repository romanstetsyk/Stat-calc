/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { FlexProps } from '@chakra-ui/react';
import {
  CheckboxGroup,
  Flex,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import type { WithRequired } from '@shared/build/esm/index';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { useController } from '~/common/hooks';

import { Legend } from './legend';

type Props<T extends FieldValues> = WithRequired<
  UseControllerProps<T>,
  'control'
> &
  FlexProps & {
    legend?: string;
  };

const CheckboxGroupControlled = <T extends FieldValues>({
  control,
  name,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  legend,
  children,
  ...flexProps
}: Props<T>): JSX.Element => {
  const {
    field: { onChange, value, disabled: isDisabled },
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
    <FormControl isInvalid={invalid} as='fieldset'>
      {legend && <Legend>{legend}</Legend>}
      <Flex flexDirection='column' pl={2} {...flexProps}>
        <CheckboxGroup
          value={value}
          onChange={onChange}
          isDisabled={isDisabled}
        >
          {children}
        </CheckboxGroup>
      </Flex>

      {error && (
        <FormErrorMessage as='span' m={0}>
          {error.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export { CheckboxGroupControlled };
