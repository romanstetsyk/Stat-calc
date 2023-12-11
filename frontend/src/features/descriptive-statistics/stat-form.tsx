/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Checkbox, Text } from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
import { useSyncExternalStore } from 'react';
import type { SubmitHandler } from 'react-hook-form';

import {
  CheckboxControlled,
  CheckboxGroupControlled,
  FieldStack,
  Form,
  Legend,
} from '~/common/components';
import { useForm } from '~/common/hooks';
import { dataStore } from '~/data-store';
import { getVarName } from '~/utils/get-column-name-and-values';

import type { TForm } from './types';
import { SampleStatistics } from './types';
import { schema } from './validation-schema/schema';

const resolver = joiResolver(schema, {
  abortEarly: false,
  errors: { wrap: { label: false } },
});

type Props = {
  formId: string;
  onSubmit: SubmitHandler<TForm>;
  defaultValues: TForm;
};

const StatForm = ({ formId, onSubmit, defaultValues }: Props): JSX.Element => {
  const { colData } = useSyncExternalStore(
    dataStore.subscribe,
    dataStore.getSnapshot,
  );

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

      <CheckboxGroupControlled
        legend='Statistics:'
        name='options'
        control={control}
      >
        {SampleStatistics.map((statistic) => {
          return (
            <Checkbox key={statistic} value={statistic}>
              {statistic}
            </Checkbox>
          );
        })}
      </CheckboxGroupControlled>
    </Form>
  );
};

export { StatForm };
