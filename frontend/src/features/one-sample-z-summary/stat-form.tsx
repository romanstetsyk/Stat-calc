import { Box, FormLabel, Grid, Radio } from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
import { useId } from 'react';
import type { SubmitHandler } from 'react-hook-form';

import {
  CheckboxControlled,
  ConfidenceIntervalFormPart,
  FieldStack,
  Form,
  HypothesisTestFormPart,
  InputField,
  Legend,
  RadioGroupControlled,
} from '~/common/components';
import { useForm } from '~/common/hooks';
import { PopulationMean } from '~/components/hypothesis-notation';
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
  defaultValues: Omit<TForm, 'sampleSummary'>;
};

const StatForm = ({ formId, onSubmit, defaultValues }: Props): JSX.Element => {
  const id = useId();

  const { handleSubmit, control, setValue, watch } = useForm<TForm>({
    defaultValues,
    resolver,
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)} id={formId}>
      <FieldStack>
        <Legend>Sample 1</Legend>

        <Grid
          templateColumns='auto 1fr'
          alignItems='baseline'
          gridColumnGap={4}
          gridRowGap={1}
        >
          <FormLabel
            m={0}
            htmlFor={id + 'xbar'}
            whiteSpace='nowrap'
            fontWeight={400}
          >
            Sample mean:
          </FormLabel>
          <InputField
            id={id + 'xbar'}
            name='sampleSummary.xbar'
            control={control}
          />

          <FormLabel
            m={0}
            htmlFor={id + 'stdev'}
            whiteSpace='nowrap'
            fontWeight={400}
          >
            Standard deviation:
          </FormLabel>
          <InputField
            id={id + 'stdev'}
            name='sampleSummary.stdev'
            control={control}
          />

          <FormLabel
            m={0}
            htmlFor={id + 'size'}
            whiteSpace='nowrap'
            fontWeight={400}
          >
            Sample size:
          </FormLabel>
          <InputField
            id={id + 'size'}
            name='sampleSummary.n'
            control={control}
          />
        </Grid>
      </FieldStack>

      <FieldStack>
        <Legend>Perform:</Legend>

        <RadioGroupControlled
          control={control}
          name='perform'
          display='grid'
          gridTemplateColumns={{ md: '1fr 1fr' }}
          gridGap={4}
        >
          <Box>
            <Radio value={Perform.HypothesisTest} mb={2}>
              Hypothesis Test
            </Radio>

            <HypothesisTestFormPart<TForm>
              ml={6}
              param={<PopulationMean />}
              alternative={{ name: 'hypothesisTest.alternative' }}
              nullValue={{ name: 'hypothesisTest.nullValue' }}
              disabled={watch('perform') !== Perform.HypothesisTest}
              control={control}
              setValue={setValue}
            >
              <InputField
                label='Significance:'
                name='hypothesisTest.alpha'
                control={control}
              />
            </HypothesisTestFormPart>
          </Box>
          <Box>
            <Radio value={Perform.ConfidenceInerval} mb={2}>
              Confidence Interval
            </Radio>

            <ConfidenceIntervalFormPart
              control={control}
              level={{ name: 'confidenceInterval.confidenceLevel' }}
              disabled={watch('perform') !== Perform.ConfidenceInerval}
              ml={6}
            />
          </Box>
        </RadioGroupControlled>
      </FieldStack>

      {watch('perform') === Perform.HypothesisTest && (
        <FieldStack>
          <Legend>Optional tables:</Legend>

          <CheckboxControlled
            name='hypothesisTest.optional.includeConfidenceInterval'
            control={control}
          >
            Confidence Interval
          </CheckboxControlled>
        </FieldStack>
      )}
    </Form>
  );
};

export { StatForm };
