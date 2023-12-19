/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Box, Checkbox, Radio, Text } from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
import type { SubmitHandler } from 'react-hook-form';

import {
  CheckboxControlled,
  CheckboxGroupControlled,
  FieldStack,
  Form,
  Legend,
  RadioGroupControlled,
} from '~/common/components';
import { useForm } from '~/common/hooks';
import { BinManual, BinSquareRoot } from '~/modules/application/components';
import { BinMethod } from '~/modules/application/enums';
import { useGridData } from '~/modules/data-grid/store';
import { getVarName } from '~/utils/get-column-name-and-values';

import type { TForm } from './types';
import { FrequencyDistribution } from './types';
import { schema } from './validation-schema/schema';

const resolver = joiResolver(schema, {
  abortEarly: false,
  errors: { wrap: { label: false } },
});

type Props = {
  onSubmit: SubmitHandler<TForm>;
  formId: string;
  defaultValues: Omit<TForm, 'manual' | 'squareRoot'>;
};

const StatForm = ({ formId, onSubmit, defaultValues }: Props): JSX.Element => {
  const { colData } = useGridData();

  const { handleSubmit, control, watch } = useForm<TForm>({
    defaultValues,
    resolver,
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)} id={formId}>
      {colData.length > 0 ? (
        <>
          <CheckboxControlled control={control} name='withLabel'>
            Labels in first row
          </CheckboxControlled>

          <CheckboxGroupControlled
            legend='Choose columns:'
            name='columns'
            control={control}
          >
            {Object.keys(colData).map((colHeader) => {
              return (
                <Checkbox key={colHeader} value={colHeader}>
                  {getVarName(colData, Number(colHeader), watch('withLabel'))}
                </Checkbox>
              );
            })}
          </CheckboxGroupControlled>
        </>
      ) : (
        <FieldStack>
          <Legend>Choose columns:</Legend>
          <Text pl={2}>No data in the table</Text>
        </FieldStack>
      )}

      <FieldStack>
        <Legend>Statiscics:</Legend>

        <RadioGroupControlled
          control={control}
          name='options'
          display='flex'
          flexDirection='column'
        >
          {FrequencyDistribution.map((option) => (
            <Radio key={option} value={option}>
              {option}
            </Radio>
          ))}
        </RadioGroupControlled>
      </FieldStack>

      <FieldStack>
        <Legend>Binning method:</Legend>

        <RadioGroupControlled control={control} name='method'>
          <Box>
            <Radio value={BinMethod.MANUAL}>Manual</Radio>

            <BinManual
              ml={6}
              control={control}
              disabled={watch('method') !== BinMethod.MANUAL}
              start={{ name: 'manual.start' }}
              binWidth={{ name: 'manual.width' }}
            />
          </Box>
          <Box>
            <Radio value={BinMethod.SQUARE_ROOT}>Square Root</Radio>

            <BinSquareRoot
              ml={6}
              control={control}
              disabled={watch('method') !== BinMethod.SQUARE_ROOT}
              start={{ name: 'squareRoot.start' }}
            />
          </Box>
        </RadioGroupControlled>
      </FieldStack>
    </Form>
  );
};

export { StatForm };
