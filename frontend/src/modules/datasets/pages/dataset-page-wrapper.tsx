import type { ToastId } from '@chakra-ui/react';
import { Progress, useToast } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { read } from 'xlsx';

import { APP_ROUTES } from '~/common/constants';
import { useGridData } from '~/modules/data-grid/store';

import { parseWorkbook } from '../helpers';
import { useOpenDataset } from '../hooks';

const DatasetPageWrapper = (): JSX.Element => {
  const { id = '' } = useParams();

  return <DatasetPage id={id} />;
};

type Props = {
  id: string;
};

const DatasetPage = ({ id }: Props): JSX.Element => {
  const { data, isSuccess, isError, error } = useOpenDataset({ id });

  const navigate = useNavigate();
  const { overwriteData } = useGridData();

  const toast = useToast();
  const toastRef = useRef<ToastId>();

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    try {
      const workbook = read(data.buffer, { cellDates: true, dense: true });
      const gridData = parseWorkbook(id, data.filename, workbook);
      overwriteData(gridData);
      toastRef.current = toast({
        title: 'Success',
        description: 'File opened successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate(APP_ROUTES.APP, { replace: true });
    } catch {
      toastRef.current = toast({
        title: 'Error',
        description: 'Could not load the file.',
        status: 'error',
        duration: null,
        isClosable: true,
      });
    }
    // Don't clear the toast so it doesn't dissapear after redirect
  }, [
    data?.buffer,
    data?.filename,
    id,
    isSuccess,
    navigate,
    overwriteData,
    toast,
  ]);

  useEffect(() => {
    if (isError) {
      toastRef.current = toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: null,
        isClosable: true,
      });
    }
    return () => {
      isError && toastRef.current && toast.close(toastRef.current);
    };
  }, [error, isError, toast]);

  return <Progress size='xs' isIndeterminate />;
};

export { DatasetPageWrapper };
