/* eslint-disable @typescript-eslint/no-magic-numbers */
import { useSyncExternalStore } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';

import {
  AskLabelCheckbox,
  CheckboxGroupWrapper,
  FormWraper,
} from '~/components/stat-form';
import { dataStore } from '~/data-store';
import { getVarName } from '~/utils/get-column-name-and-values';

import type { TForm } from './types';
import { FrequencyDistribution } from './types';

type Props = {
  onSubmit: SubmitHandler<TForm>;
  formId: string;
  defaultValues: TForm;
};

const StatForm = ({ onSubmit, formId, defaultValues }: Props): JSX.Element => {
  const { colData } = useSyncExternalStore(
    dataStore.subscribe,
    dataStore.getSnapshot,
  );

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<TForm>({
    defaultValues,
  });

  return (
    <FormWraper onSubmit={handleSubmit(onSubmit)} formId={formId}>
      {colData.length > 0 && (
        <Controller
          name='withLabel'
          control={control}
          defaultValue={defaultValues.withLabel}
          render={({ field }): JSX.Element => <AskLabelCheckbox {...field} />}
        />
      )}

      <CheckboxGroupWrapper
        label='Choose columns:'
        name='columns'
        data={Object.keys(colData).map((colHeader) => ({
          title: getVarName(colData, Number(colHeader), watch('withLabel')),
          value: colHeader,
        }))}
        control={control}
        defaultValue={defaultValues.columns}
        rules={{ required: 'Select at least one column' }}
        error={errors.columns}
      />

      <CheckboxGroupWrapper
        label='Statistics:'
        name='options'
        data={[...FrequencyDistribution]}
        control={control}
        defaultValue={defaultValues.options}
        rules={{ required: 'Select at least one statistic' }}
        error={errors.options}
      />
    </FormWraper>
  );
};

export { StatForm };
