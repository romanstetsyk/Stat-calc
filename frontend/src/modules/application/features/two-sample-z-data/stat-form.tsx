import { Box, Flex, Radio, useDisclosure } from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
import { useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';

import {
  AlertModal,
  CheckboxControlled,
  FieldStack,
  Form,
  InputField,
  Legend,
  RadioGroupControlled,
  SelectField,
} from '~/common/components';
import { useForm } from '~/common/hooks';
import {
  ConfidenceIntervalFormPart,
  HypothesisTestFormPart,
  PopulationMeanDifference,
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
  defaultValues: Omit<TForm, 'sample1Data' | 'sample2Data'> &
    Partial<Pick<TForm, 'sample1Data' | 'sample2Data'>>;
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
    [
      defaultValues.sample1Data?.sample1,
      defaultValues.sample2Data?.sample2,
    ].filter((e): e is Exclude<typeof e, undefined> => e !== undefined),
  );

  const showAlert = deletedColumns.length > 0;
  const alertDescription =
    existingColumns.length === 0 ? ColumnsError.All : ColumnsError.One;

  const { handleSubmit, control, setValue, watch } = useForm<TForm>({
    defaultValues: {
      ...defaultValues,
      sample1Data: {
        ...defaultValues.sample1Data,
        sample1: existingColumns.find(
          (e) => e === defaultValues.sample1Data?.sample1,
        ),
      },
      sample2Data: {
        ...defaultValues.sample2Data,
        sample2: existingColumns.find(
          (e) => e === defaultValues.sample2Data?.sample2,
        ),
      },
    },
    resolver,
  });

  const colDataKeys = useMemo(() => Object.keys(colData), [colData]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} id={formId}>
      {colData.length > 0 && (
        <>
          <CheckboxControlled control={control} name='withLabel'>
            Labels in first row
          </CheckboxControlled>
        </>
      )}

      <Flex flexDirection={{ base: 'column', md: 'row' }} gap={4}>
        <FieldStack flex='1'>
          <Legend>Sample 1</Legend>

          <SelectField
            name='sample1Data.sample1'
            label='Column:'
            placeholder='Select column'
            control={control}
          >
            {colDataKeys.map((colHeader) => (
              <option key={colHeader} value={colHeader}>
                {getVarName(colData, Number(colHeader), watch('withLabel'))}
              </option>
            ))}
          </SelectField>

          <InputField
            label='Known Standard Deviation:'
            placeholder='optional'
            name='sample1Data.knownStdev1'
            control={control}
          />
        </FieldStack>
        <FieldStack flex='1'>
          <Legend>Sample 2</Legend>

          <SelectField
            name='sample2Data.sample2'
            label='Column:'
            placeholder='Select column'
            control={control}
          >
            {colDataKeys.map((colHeader) => (
              <option key={colHeader} value={colHeader}>
                {getVarName(colData, Number(colHeader), watch('withLabel'))}
              </option>
            ))}
          </SelectField>
          <InputField
            label='Known Standard Deviation:'
            placeholder='optional'
            name='sample2Data.knownStdev2'
            control={control}
          />
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

            <HypothesisTestFormPart<TForm>
              ml={6}
              param={<PopulationMeanDifference />}
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
