import type { FlexProps } from '@chakra-ui/react';
import { Box, FormLabel, Grid, Input, Select } from '@chakra-ui/react';
import { useId, useRef } from 'react';
import type {
  FieldValues,
  Path,
  PathValue,
  UseControllerProps,
  UseFormSetValue,
} from 'react-hook-form';

import { get } from '~/common/helpers';
import { useFormState, useWatch } from '~/common/hooks';
import { H0Sign, H1Sign } from '~/types';

import { FieldStack } from '../field-stack';
import { InputField } from '../input-field';
import { SelectField } from '../select-field';

type Props<T extends FieldValues> = Pick<
  UseControllerProps<T>,
  'control' | 'disabled'
> & {
  param: JSX.Element;
  alternative: Omit<UseControllerProps<T>, 'control'>;
  nullValue: Omit<UseControllerProps<T>, 'control'>;
  setValue: UseFormSetValue<T>;
} & FlexProps;

const HypothesisTestFormPart = <T extends FieldValues>({
  param,
  alternative,
  nullValue,
  disabled,
  control,
  children,
  setValue,
  ...restProps
}: Props<T>): JSX.Element => {
  const { isSubmitted, errors } = useFormState({
    control,
    name: [nullValue.name, alternative.name],
  });

  const id = useId();
  const nullValueId = id + nullValue.name;
  const signId = id + alternative.name;

  const currentNullValue = useWatch({ control, name: nullValue.name });
  const currentAlternative = useWatch({ control, name: alternative.name });

  const onSelectChange = (event: React.ChangeEvent): void => {
    const { value } = event.target as HTMLSelectElement;
    setValue(alternative.name, value as PathValue<T, Path<T>>, {
      shouldValidate: isSubmitted,
    });
  };

  const onNullValueChange = (e: React.ChangeEvent): void => {
    const { value } = e.target as HTMLInputElement;
    setValue(nullValue.name, value as PathValue<T, Path<T>>, {
      shouldValidate: isSubmitted,
    });
  };

  const ref = useRef<HTMLDivElement>(null);

  return (
    <FieldStack
      disabled={disabled}
      opacity={disabled ? '0.5' : '1'}
      {...restProps}
    >
      <Grid
        gridTemplateColumns='min-content max-content auto'
        alignItems='baseline'
        gridColumnGap={2}
      >
        <FormLabel m={0} htmlFor={nullValueId} whiteSpace='nowrap'>
          H<sub>0</sub>: {param}
        </FormLabel>

        <Select
          id={id + 'currentAlternative'}
          name='currentAlternative'
          value={currentAlternative}
          onChange={onSelectChange}
          isInvalid={get(errors, alternative.name)}
        >
          {Object.entries(H0Sign).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </Select>

        <InputField
          id={nullValueId}
          errorContainerRef={ref}
          control={control}
          {...nullValue}
        />

        <FormLabel m={0} htmlFor={signId} whiteSpace='nowrap'>
          H<sub>a</sub>: {param}
        </FormLabel>

        <SelectField
          id={signId}
          control={control}
          {...alternative}
          errorContainerRef={ref}
        >
          {Object.entries(H1Sign).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </SelectField>

        <Input
          id={id + 'currentNullValue'}
          value={currentNullValue}
          onChange={onNullValueChange}
          isInvalid={get(errors, nullValue.name)}
        />
        <Box ref={ref} gridColumn={3}></Box>
      </Grid>

      {children}
    </FieldStack>
  );
};

export { HypothesisTestFormPart };
