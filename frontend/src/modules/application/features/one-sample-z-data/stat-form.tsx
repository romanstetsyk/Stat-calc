import { Box, Checkbox, Radio, Text, useDisclosure } from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
import { useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';

import {
  AlertModal,
  CheckboxControlled,
  CheckboxGroupControlled,
  FieldStack,
  Form,
  InputField,
  Legend,
  RadioGroupControlled,
} from '~/common/components';
import { useForm } from '~/common/hooks';
import {
  ConfidenceIntervalFormPart,
  HypothesisTestFormPart,
  PopulationMean,
} from '~/modules/application/components';
import { Perform } from '~/modules/application/enums';
import { useGridData } from '~/modules/data-grid/store';
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
  alertCloseRef: React.MutableRefObject<null>;
};

const StatForm = ({
  formId,
  onSubmit,
  defaultValues,
  alertCloseRef,
}: Props): JSX.Element => {
  const { onClose, isOpen } = useDisclosure({ defaultIsOpen: true });
  const { colData } = useGridData();

  const colDataKeys = useMemo(() => Object.keys(colData), [colData]);
  const columns = useMemo(
    () =>
      defaultValues.sampleData.columns.filter((c) => colDataKeys.includes(c)),
    [colDataKeys, defaultValues.sampleData.columns],
  );

  const shouldAlert =
    columns.length !== defaultValues.sampleData.columns.length;

  const { handleSubmit, control, setValue, watch } = useForm<TForm>({
    defaultValues: {
      ...defaultValues,
      sampleData: { ...defaultValues.sampleData, columns },
    },
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
            {colDataKeys.map((colHeader) => {
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

      {shouldAlert && (
        <AlertModal
          onClose={onClose}
          isOpen={isOpen}
          title='Warning'
          description={`${
            columns.length === 0 ? 'All' : 'One or more'
          } columns included in the table have been deleted from the spreadsheet`}
          finalFocusRef={alertCloseRef}
        />
      )}
    </Form>
  );
};

export { StatForm };
