import { RepeatIcon } from '@chakra-ui/icons';
import { IconButton, Tooltip, useDisclosure } from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';

import { AlertModal } from '~/common/components';
import { ColumnsError } from '~/modules/application/enums';
import { calcStatistics } from '~/modules/application/features/descriptive-statistics/calc-statistics';
import { calcFrequency } from '~/modules/application/features/frequency-distribution/calc-frequency';
import { calcGroups } from '~/modules/application/features/group-numeric-data/calc-groups';
import { calcHistogram } from '~/modules/application/features/histogram/calc-histogram';
import { calcZ1Data } from '~/modules/application/features/one-sample-z-data/calc-z1-data';
import { calcZ1Summary } from '~/modules/application/features/one-sample-z-summary/calc-z1-summary';
import { calcZ2Data } from '~/modules/application/features/two-sample-z-data/calc-z2-data';
import { calcZ2Summary } from '~/modules/application/features/two-sample-z-summary/calc-z2-summary';
import { useGridData } from '~/modules/data-grid/store';

import { useSessionData } from '../store';

type Props = {
  id: string;
};

const RefreshBtn = ({ id }: Props): JSX.Element => {
  const { session, updateSessionItem } = useSessionData();
  const { colData, getColumnChanges } = useGridData();
  const item = session.find((item) => item.id === id);

  const [alertContinue, setAlertContinue] = useState(false);
  const [alertDescription, setAlertDescription] = useState(
    ColumnsError.OneOrMore,
  );

  const alertCloseRef = useRef(null);

  const { onClose, isOpen, onOpen } = useDisclosure();

  const refreshSessionItem = useCallback(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    (withConfirmation: boolean) => () => {
      switch (item?.type) {
        case 'frequencyDistribution': {
          const { existingColumns, deletedColumns } = getColumnChanges(
            item.formSummary.columns,
          );

          if (existingColumns.length === 0) {
            setAlertContinue(() => false);
            setAlertDescription(() => ColumnsError.All);
            onOpen();
            return;
          }

          if (deletedColumns.length > 0 && withConfirmation) {
            setAlertContinue(() => true);
            setAlertDescription(() => ColumnsError.OneOrMore);
            onOpen();
            return;
          }

          const formSummary = { ...item.formSummary, columns: existingColumns };
          updateSessionItem({
            ...item,
            timestamp: Date.now(),
            data: calcFrequency(formSummary, colData),
            formSummary,
          });
          break;
        }

        case 'groupNumericalData': {
          const { existingColumns, deletedColumns } = getColumnChanges(
            item.formSummary.columns,
          );

          if (existingColumns.length === 0) {
            setAlertContinue(() => false);
            setAlertDescription(() => ColumnsError.All);
            onOpen();
            return;
          }

          if (deletedColumns.length > 0 && withConfirmation) {
            setAlertContinue(() => true);
            setAlertDescription(() => ColumnsError.OneOrMore);
            onOpen();
            return;
          }

          const formSummary = { ...item.formSummary, columns: existingColumns };
          updateSessionItem({
            ...item,
            timestamp: Date.now(),
            data: calcGroups(formSummary, colData),
            formSummary,
          });
          break;
        }

        case 'histogram': {
          const { existingColumns, deletedColumns } = getColumnChanges(
            item.formSummary.columns,
          );

          if (existingColumns.length === 0) {
            setAlertContinue(() => false);
            setAlertDescription(() => ColumnsError.All);
            onOpen();
            return;
          }

          if (deletedColumns.length > 0 && withConfirmation) {
            setAlertContinue(() => true);
            setAlertDescription(() => ColumnsError.OneOrMore);
            onOpen();
            return;
          }

          const formSummary = { ...item.formSummary, columns: existingColumns };
          updateSessionItem({
            ...item,
            timestamp: Date.now(),
            data: calcHistogram(formSummary, colData),
            formSummary,
          });
          break;
        }

        case 'descriptive': {
          const { existingColumns, deletedColumns } = getColumnChanges(
            item.formSummary.columns,
          );

          if (existingColumns.length === 0) {
            setAlertContinue(() => false);
            setAlertDescription(() => ColumnsError.All);
            onOpen();
            return;
          }

          if (deletedColumns.length > 0 && withConfirmation) {
            setAlertContinue(() => true);
            setAlertDescription(() => ColumnsError.OneOrMore);
            onOpen();
            return;
          }

          const formSummary = { ...item.formSummary, columns: existingColumns };
          updateSessionItem({
            ...item,
            timestamp: Date.now(),
            data: calcStatistics(formSummary, colData),
            formSummary,
          });
          break;
        }

        case 'z1summary': {
          updateSessionItem({
            ...item,
            timestamp: Date.now(),
            data: calcZ1Summary(item.formSummary),
          });
          break;
        }

        case 'z2summary': {
          updateSessionItem({
            ...item,
            timestamp: Date.now(),
            data: calcZ2Summary(item.formSummary),
          });
          break;
        }

        case 'z1data': {
          const { existingColumns, deletedColumns } = getColumnChanges(
            item.formSummary.sampleData.columns,
          );

          if (existingColumns.length === 0) {
            setAlertContinue(() => false);
            setAlertDescription(() => ColumnsError.All);
            onOpen();
            return;
          }

          if (deletedColumns.length > 0 && withConfirmation) {
            setAlertContinue(() => true);
            setAlertDescription(() => ColumnsError.OneOrMore);
            onOpen();
            return;
          }

          const formSummary = {
            ...item.formSummary,
            sampleData: {
              ...item.formSummary.sampleData,
              columns: existingColumns,
            },
          };

          updateSessionItem({
            ...item,
            timestamp: Date.now(),
            data: calcZ1Data(formSummary, colData),
            formSummary,
          });
          break;
        }

        case 'z2data': {
          const { existingColumns, deletedColumns } = getColumnChanges([
            item.formSummary.sample1Data.sample1,
            item.formSummary.sample2Data.sample2,
          ]);

          if (existingColumns.length === 0) {
            setAlertContinue(() => false);
            setAlertDescription(() => ColumnsError.All);
            onOpen();
            return;
          }

          if (deletedColumns.length > 0) {
            setAlertContinue(() => false);
            setAlertDescription(() => ColumnsError.One);
            onOpen();
            return;
          }

          updateSessionItem({
            ...item,
            timestamp: Date.now(),
            data: calcZ2Data(item.formSummary, colData),
          });
          break;
        }

        default: {
          throw new Error('fask');
        }
      }
    },
    [getColumnChanges, colData, item, onOpen, updateSessionItem],
  );

  return (
    <>
      <Tooltip hasArrow label='Refresh' placement='top' fontSize='xs'>
        <IconButton
          ref={alertCloseRef}
          variant='ghost'
          size='sm'
          aria-label='Refresh'
          icon={<RepeatIcon />}
          onClick={refreshSessionItem(true)}
        />
      </Tooltip>

      <AlertModal
        isOpen={isOpen}
        onClose={onClose}
        title='Warning'
        description={alertDescription}
        finalFocusRef={alertCloseRef}
        onContinue={alertContinue ? refreshSessionItem(false) : undefined}
      />
    </>
  );
};

export { RefreshBtn };
