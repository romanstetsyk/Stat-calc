/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
} from '@chakra-ui/react';
import { useId } from 'react';
import type {
  Control,
  FieldError,
  FieldValues,
  Merge,
  Path,
  PathValue,
  RegisterOptions,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { LegendWrapper } from './legend-wrapper';

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  data: { title: string; value: string }[] | string[];
  defaultValue: PathValue<T, Path<T>>;
  label?: string;
  rules?: RegisterOptions;
  error?: Merge<FieldError, (FieldError | undefined)[]>;
};

const CheckboxGroupWrapper = <T extends FieldValues>({
  name,
  control,
  data,
  defaultValue,
  label,
  rules,
  error,
}: Props<T>): JSX.Element => {
  const checkboxID = useId();
  return (
    <FormControl isInvalid={Boolean(error)} as='fieldset'>
      {label && <LegendWrapper legend={label} elem={FormLabel} />}
      <Box pl={2}>
        {data.length > 0 ? (
          <>
            <Controller
              defaultValue={defaultValue}
              name={name}
              control={control}
              rules={rules}
              render={({
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                field: { ref: _ref, onChange, ...field },
              }): JSX.Element => (
                <CheckboxGroup
                  onChange={(value: PathValue<T, Path<T>>): void => {
                    onChange(value);
                  }}
                  {...field}
                >
                  {data
                    .map((e) =>
                      typeof e === 'string' ? { title: e, value: e } : e,
                    )
                    .map(({ title, value }) => (
                      <Checkbox
                        id={value + checkboxID}
                        key={value}
                        name={name}
                        value={value}
                        display='flex'
                      >
                        {title}
                      </Checkbox>
                    ))}
                </CheckboxGroup>
              )}
            />

            <FormErrorMessage>
              {error?.type === 'required' && error.message}
            </FormErrorMessage>
          </>
        ) : (
          <Text>No data in the table</Text>
        )}
      </Box>
    </FormControl>
  );
};

export { CheckboxGroupWrapper };