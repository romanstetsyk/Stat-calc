import { Checkbox, Text, useDisclosure } from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
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
import { useGridData } from '~/modules/data-grid/hooks';
import { getVarName } from '~/utils/get-column-name-and-values';

import type { TForm } from './types';
import { FrequencyDistribution } from './types';
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
    defaultValues.columns,
  );

  const showAlert = deletedColumns.length > 0;
  const alertDescription =
    existingColumns.length === 0 ? ColumnsError.All : ColumnsError.OneOrMore;

  const { handleSubmit, control, watch } = useForm<TForm>({
    defaultValues: { ...defaultValues, columns: existingColumns },
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
            {Object.keys(colData).map((colHeader) => {
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
        {FrequencyDistribution.map((option) => {
          return (
            <Checkbox key={option} value={option}>
              {option}
            </Checkbox>
          );
        })}
      </CheckboxGroupControlled>

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
