import { Checkbox, Text, useDisclosure } from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
import { useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';

import {
  AlertModal,
  CheckboxControlled,
  CheckboxGroupControlled,
  FieldStack,
  Form,
  Legend,
} from '~/common/components';
import { useForm } from '~/common/hooks';
import { ColumnsError } from '~/modules/application/enums';
import { useGridData } from '~/modules/data-grid/store';
import { getVarName } from '~/utils/get-column-name-and-values';

import type { TForm } from './types';
import { SampleStatistics } from './types';
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
    () => defaultValues.columns.filter((c) => colDataKeys.includes(c)),
    [colDataKeys, defaultValues.columns],
  );

  const shouldAlert = columns.length !== defaultValues.columns.length;

  const { handleSubmit, control, watch } = useForm<TForm>({
    defaultValues: { ...defaultValues, columns },
    resolver,
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)} id={formId}>
      {colData.length > 0 ? (
        <>
          <CheckboxControlled control={control} name='withLabel'>
            Labels in first row
          </CheckboxControlled>

          <CheckboxGroupControlled
            legend='Choose columns:'
            name='columns'
            control={control}
          >
            {colDataKeys.map((colHeader) => {
              return (
                <Checkbox key={colHeader} value={colHeader}>
                  {getVarName(colData, Number(colHeader), watch('withLabel'))}
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

      <CheckboxGroupControlled
        legend='Statistics:'
        name='options'
        control={control}
      >
        {SampleStatistics.map((statistic) => {
          return (
            <Checkbox key={statistic} value={statistic}>
              {statistic}
            </Checkbox>
          );
        })}
      </CheckboxGroupControlled>

      {shouldAlert && (
        <AlertModal
          onClose={onClose}
          isOpen={isOpen}
          title='Warning'
          description={
            columns.length === 0 ? ColumnsError.All : ColumnsError.OneOrMore
          }
          finalFocusRef={alertCloseRef}
        />
      )}
    </Form>
  );
};

export { StatForm };
