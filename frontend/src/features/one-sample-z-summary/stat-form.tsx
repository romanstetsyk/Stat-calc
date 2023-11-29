import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  Text,
} from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';

import { PopulationMean } from '~/components/hypothesis-notation';
import {
  CIFormPart,
  FieldStack,
  FormWraper,
  HTFormPart,
  InputField,
  LegendWrapper,
  RadioGroupWrapper,
} from '~/components/stat-form';
import { Perform } from '~/types';

import type { TForm } from './types';
import { schema } from './validation-schema/schema';

const resolver = joiResolver(schema, {
  abortEarly: false,
  errors: { wrap: { label: false } },
});

type Props = {
  formId: string;
  onSubmit: SubmitHandler<TForm>;
  defaultValues: Omit<TForm, 'sampleData'>;
};

const StatForm = ({ formId, onSubmit, defaultValues }: Props): JSX.Element => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TForm>({ defaultValues, resolver });

  return (
    <FormWraper onSubmit={handleSubmit(onSubmit)} formId={formId}>
      <FieldStack>
        <LegendWrapper elem={Text} legend='Sample 1' />

        <InputField
          label='Sample mean'
          name='sampleData.xbar'
          register={register}
          error={errors.sampleData?.xbar}
        />

        <InputField
          label='Std. dev.'
          name='sampleData.stdev'
          register={register}
          error={errors.sampleData?.stdev}
        />

        <InputField
          label='Sample size'
          name='sampleData.n'
          register={register}
          error={errors.sampleData?.n}
        />
      </FieldStack>

      <FormControl as='fieldset' isInvalid={Boolean(errors.perform)}>
        <LegendWrapper elem={FormLabel} legend='Perform:' />

        <Controller
          name='perform'
          control={control}
          defaultValue={defaultValues.perform}
          render={({ field }): JSX.Element => (
            <RadioGroupWrapper {...field}>
              <Box flex='1'>
                <Radio value={Perform.HypothesisTest} mb={2}>
                  Hypothesis Test
                </Radio>

                <HTFormPart
                  ml={6}
                  param={<PopulationMean />}
                  alternative='hypothesisTest.alternative'
                  alternativeDefault={defaultValues.hypothesisTest.alternative}
                  nullValue='hypothesisTest.nullValue'
                  nullValueDefault={defaultValues.hypothesisTest.nullValue}
                  disabled={watch('perform') !== Perform.HypothesisTest}
                  control={control}
                  setValue={setValue}
                  nullError={errors.hypothesisTest?.nullValue}
                  alternativeError={errors.hypothesisTest?.alternative}
                >
                  <InputField
                    label='&alpha;'
                    name='hypothesisTest.alpha'
                    register={register}
                    error={errors.hypothesisTest?.alpha}
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
                  level='confidenceInterval.confidenceLevel'
                  levelError={errors.confidenceInterval?.confidenceLevel}
                />
              </Box>
            </RadioGroupWrapper>
          )}
        />
        <FormErrorMessage as='span'>{errors.perform?.message}</FormErrorMessage>
      </FormControl>

      {watch('perform') === Perform.HypothesisTest && (
        <FieldStack>
          <LegendWrapper elem={Text} legend='Optional tables:' />

          <Checkbox
            {...register('hypothesisTest.optional.includeConfidenceInterval')}
          >
            Confidence Interval
          </Checkbox>
        </FieldStack>
      )}
    </FormWraper>
  );
};

export { StatForm };
