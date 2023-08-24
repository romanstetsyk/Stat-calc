/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
} from '@chakra-ui/react';
import { useSyncExternalStore } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';

import {
  AskLabelCheckbox,
  BinManual,
  BinSquareRoot,
  CheckboxGroupWrapper,
  FormWraper,
  LegendWrapper,
  RadioGroupWrapper,
} from '~/components/stat-form';
import { dataStore } from '~/data-store';
import { BinMethod } from '~/types';
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
    register,
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

      <FormControl isInvalid={Boolean(errors.method)} as='fieldset'>
        <LegendWrapper elem={FormLabel} legend='Binning method:' />

        <Controller
          name='method'
          control={control}
          rules={{ required: 'This field is required' }}
          defaultValue={defaultValues.method}
          render={({ field }): JSX.Element => (
            <RadioGroupWrapper<BinMethod>
              {...field}
              flexDirection='column'
              gap={0}
            >
              <Radio value={BinMethod.MANUAL}>Manual</Radio>

              <BinManual
                ml={6}
                register={register}
                disabled={watch('method') !== BinMethod.MANUAL}
                start='manual.start'
                startError={errors.manual?.start}
                width='manual.width'
                widthError={errors.manual?.width}
              />

              <Radio value={BinMethod.SQUARE_ROOT}>Square Root</Radio>

              <BinSquareRoot
                ml={6}
                register={register}
                disabled={watch('method') !== BinMethod.SQUARE_ROOT}
                start='squareRoot.start'
                startError={errors.squareRoot?.start}
              />
            </RadioGroupWrapper>
          )}
        />
        <FormErrorMessage as='span'>{errors.method?.message}</FormErrorMessage>
      </FormControl>
    </FormWraper>
  );
};

export { StatForm };
