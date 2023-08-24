/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  Text,
} from '@chakra-ui/react';
import { useSyncExternalStore } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';

import { PopulationMeanDiff } from '~/components/hypothesis-notation';
import {
  AskLabelCheckbox,
  CIFormPart,
  FieldStack,
  FormBlock,
  FormWraper,
  HTFormPart,
  InputField,
  LegendWrapper,
  RadioGroupWrapper,
  SelectField,
} from '~/components/stat-form';
import { dataStore } from '~/data-store';
import { Perform } from '~/types';
import { getVarName } from '~/utils/get-column-name-and-values';
import { isPositiveNumber, isValidLevel } from '~/utils/validators';

import type { TForm } from './types';

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

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TForm>({ defaultValues });

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

      <FormBlock>
        <FieldStack flex='1'>
          <LegendWrapper elem={Text} legend='Sample 1' />

          <SelectField
            name='sample1'
            label='Column'
            placeholder='Select column'
            register={register}
            // eslint-disable-next-line sonarjs/no-duplicate-string
            rules={{ required: 'This value is required' }}
            error={errors.sample1}
          >
            {Object.keys(colData).map((colHeader) => (
              <option key={colHeader} value={colHeader}>
                {getVarName(colData, Number(colHeader), watch('withLabel'))}
              </option>
            ))}
          </SelectField>

          <InputField
            label='Std. dev.'
            placeholder='optional'
            name='stdev1'
            register={register}
            rules={{
              validate: (value) => value === '' || isPositiveNumber(value),
            }}
            error={errors.stdev1}
          />
        </FieldStack>
        <FieldStack flex='1'>
          <LegendWrapper elem={Text} legend='Sample 2' />

          <SelectField
            name='sample2'
            label='Column'
            placeholder='Select column'
            register={register}
            rules={{ required: 'This value is required' }}
            error={errors.sample2}
          >
            {Object.keys(colData).map((colHeader) => (
              <option key={colHeader} value={colHeader}>
                {getVarName(colData, Number(colHeader), watch('withLabel'))}
              </option>
            ))}
          </SelectField>
          <InputField
            label='Std. dev.'
            placeholder='optional'
            name='stdev2'
            register={register}
            rules={{
              validate: (value) => value === '' || isPositiveNumber(value),
            }}
            error={errors.stdev2}
          />
        </FieldStack>
      </FormBlock>

      <FormControl as='fieldset' isInvalid={Boolean(errors.perform)}>
        <LegendWrapper elem={FormLabel} legend='Perform:' />

        <Controller
          name='perform'
          control={control}
          rules={{ required: 'This field is required' }}
          defaultValue={defaultValues.perform}
          render={({ field }): JSX.Element => (
            <RadioGroupWrapper {...field}>
              <Box flex='1'>
                <Radio value={Perform.HypothesisTest} mb={2}>
                  Hypothesis Test
                </Radio>

                <HTFormPart
                  ml={6}
                  param={<PopulationMeanDiff />}
                  alternative='alternative'
                  alternativeDefault={defaultValues.alternative}
                  nullValue='nullValue'
                  nullValueDefault={defaultValues.nullValue}
                  disabled={watch('perform') !== Perform.HypothesisTest}
                  control={control}
                  setValue={setValue}
                  nullError={errors.nullValue}
                >
                  <InputField
                    label='&alpha;'
                    name='alpha'
                    register={register}
                    rules={{
                      required: {
                        value: watch('perform') === Perform.HypothesisTest,
                        message: 'This value is required',
                      },
                      validate: (value) =>
                        watch('perform') !== Perform.HypothesisTest ||
                        isValidLevel(value),
                    }}
                    error={errors.alpha}
                  />
                </HTFormPart>
              </Box>
              <Box flex='1'>
                <Radio value={Perform.ConfidenceInerval} mb={2}>
                  Confidence Interval
                </Radio>

                <CIFormPart
                  ml={6}
                  register={register}
                  disabled={watch('perform') !== Perform.ConfidenceInerval}
                  level='level'
                  levelError={errors.level}
                />
              </Box>
            </RadioGroupWrapper>
          )}
        />
        <FormErrorMessage as='span'>{errors.perform?.message}</FormErrorMessage>
      </FormControl>

      <FieldStack>
        <LegendWrapper elem={Text} legend='Optional tables:' />
        <Checkbox {...register('optional.sampleStatistics')}>
          Sample Statistics
        </Checkbox>
        {watch('perform') === Perform.HypothesisTest && (
          <Checkbox {...register('optional.confidenceInterval')}>
            ConfidenceInterval
          </Checkbox>
        )}
      </FieldStack>
    </FormWraper>
  );
};

export { StatForm };
