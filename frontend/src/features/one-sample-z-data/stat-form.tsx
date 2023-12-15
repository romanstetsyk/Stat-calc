/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Box, Checkbox, Radio, Text } from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
import type { SubmitHandler } from 'react-hook-form';

import {
  CheckboxControlled,
  CheckboxGroupControlled,
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
import { useGridData } from '~/modules/data-grid/store';
import { Perform } from '~/types';
import { getVarName } from '~/utils/get-column-name-and-values';

import type { TForm } from './types';
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
  const { colData } = useGridData();

  const { handleSubmit, control, setValue, watch } = useForm<TForm>({
    defaultValues,
    resolver,
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)} id={formId}>
      {colData.length > 0 ? (
        <>
          <CheckboxControlled control={control} name='sampleData.withLabel'>
            Labels in first row
          </CheckboxControlled>

          <CheckboxGroupControlled
            legend='Choose columns:'
            name='sampleData.columns'
            control={control}
          >
            {Object.keys(colData).map((colHeader) => {
              return (
                <Checkbox key={colHeader} value={colHeader}>
                  {getVarName(
                    colData,
                    Number(colHeader),
                    watch('sampleData.withLabel'),
                  )}
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

      <InputField
        label='Known Standard Deviation:'
        placeholder='optional'
        name='sampleData.knownStdev'
        control={control}
      />

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
