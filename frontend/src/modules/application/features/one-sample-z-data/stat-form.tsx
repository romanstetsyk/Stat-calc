import { Box, Checkbox, Radio, Text, useDisclosure } from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
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
import { ColumnsError, Perform } from '~/modules/application/enums';
import { useGridData } from '~/modules/data-grid/hooks';
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
  const { colData, getColumnChanges } = useGridData();

  const { existingColumns, deletedColumns } = getColumnChanges(
    defaultValues.sampleData.columns,
  );

  const showAlert = deletedColumns.length > 0;
  const alertDescription =
    existingColumns.length === 0 ? ColumnsError.All : ColumnsError.OneOrMore;

  const { handleSubmit, control, setValue, watch } = useForm<TForm>({
    defaultValues: {
      ...defaultValues,
      sampleData: { ...defaultValues.sampleData, columns: existingColumns },
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

      {showAlert && (
        <AlertModal
          onClose={onClose}
          isOpen={isOpen}
          title='Warning'
          description={alertDescription}
          finalFocusRef={alertCloseRef}
        />
      )}
    </Form>
  );
};

export { StatForm };
