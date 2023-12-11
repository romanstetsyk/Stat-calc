import { Box, Flex, FormLabel, Grid, Radio, useId } from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
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
import { PopulationMeanDiff } from '~/components/hypothesis-notation';
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
  defaultValues: Omit<TForm, 'sample1Summary' | 'sample2Summary'>;
};

const StatForm = ({ formId, onSubmit, defaultValues }: Props): JSX.Element => {
  const id = useId();

  const { handleSubmit, control, setValue, watch } = useForm<TForm>({
    defaultValues,
    resolver,
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)} id={formId}>
      <Flex flexDirection={{ base: 'column', md: 'row' }} gap={4}>
        <FieldStack flex='1'>
          <Legend>Sample 1</Legend>

          <Grid
            templateColumns='auto 1fr'
            alignItems='baseline'
            gridColumnGap={4}
            gridRowGap={1}
          >
            <FormLabel
              m={0}
              htmlFor={id + 'xbar1'}
              whiteSpace='nowrap'
              fontWeight={400}
            >
              Sample mean:
            </FormLabel>
            <InputField
              id={id + 'xbar1'}
              name='sample1Summary.xbar1'
              control={control}
            />

            <FormLabel
              m={0}
              htmlFor={id + 'stdev1'}
              whiteSpace='nowrap'
              fontWeight={400}
            >
              Standard deviation:
            </FormLabel>
            <InputField
              id={id + 'stdev1'}
              name='sample1Summary.stdev1'
              control={control}
            />

            <FormLabel
              m={0}
              htmlFor={id + 'n1'}
              whiteSpace='nowrap'
              fontWeight={400}
            >
              Sample size:
            </FormLabel>
            <InputField
              id={id + 'n1'}
              name='sample1Summary.n1'
              control={control}
            />
          </Grid>
        </FieldStack>

        <FieldStack flex='1'>
          <Legend>Sample 2</Legend>

          <Grid
            templateColumns='auto 1fr'
            alignItems='baseline'
            gridColumnGap={4}
            gridRowGap={1}
          >
            <FormLabel
              m={0}
              htmlFor={id + 'xbar2'}
              whiteSpace='nowrap'
              fontWeight={400}
            >
              Sample mean:
            </FormLabel>
            <InputField
              id={id + 'xbar2'}
              name='sample2Summary.xbar2'
              control={control}
            />

            <FormLabel
              m={0}
              htmlFor={id + 'stdev2'}
              whiteSpace='nowrap'
              fontWeight={400}
            >
              Standard deviation:
            </FormLabel>
            <InputField
              id={id + 'stdev2'}
              name='sample2Summary.stdev2'
              control={control}
            />

            <FormLabel
              m={0}
              htmlFor={id + 'n2'}
              whiteSpace='nowrap'
              fontWeight={400}
            >
              Sample size:
            </FormLabel>
            <InputField
              id={id + 'n2'}
              name='sample2Summary.n2'
              control={control}
            />
          </Grid>
        </FieldStack>
      </Flex>

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

            <HypothesisTestFormPart
              ml={6}
              param={<PopulationMeanDiff />}
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

      <FieldStack>
        <Legend>Optional tables:</Legend>

        <CheckboxControlled
          name='optional.includeSampleStatistics'
          control={control}
        >
          Sample Statistics
        </CheckboxControlled>

        {watch('perform') === Perform.HypothesisTest && (
          <CheckboxControlled
            name='hypothesisTest.optional.includeConfidenceInterval'
            control={control}
          >
            Confidence Interval
          </CheckboxControlled>
        )}
      </FieldStack>
    </Form>
  );
};

export { StatForm };
