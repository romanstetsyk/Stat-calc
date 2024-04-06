import type { ToastId } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import type {
  DatasetFindOneRepsonseDTO,
  DatasetFindOneURLParams,
  ErrorCommon,
} from '@shared/build/esm';
import type { UseMutationResult } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useMutation } from '~/common/hooks';

import { datasetApi } from '../api';

type UseDownloadDataset = () => UseMutationResult<
  DatasetFindOneRepsonseDTO,
  ErrorCommon,
  DatasetFindOneURLParams
>;

const useDownloadDataset: UseDownloadDataset = () => {
  const mutationResult = useMutation<
    DatasetFindOneRepsonseDTO,
    ErrorCommon,
    DatasetFindOneURLParams
  >({
    mutationKey: ['download'],
    mutationFn: datasetApi.findOne.bind(datasetApi),
  });

  const toast = useToast();
  const toastRef = useRef<ToastId>();

  const { isError, error, isSuccess, data } = mutationResult;

  useEffect(() => {
    let href: string;
    if (isSuccess) {
      const link = document.createElement('a');
      href = URL.createObjectURL(new Blob([data.buffer]));
      link.href = href;
      link.download = data.filename;
      link.click();
    }
    return () => {
      URL.revokeObjectURL(href);
    };
  }, [data?.buffer, data?.filename, isSuccess]);

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
      toastRef.current && toast.close(toastRef.current);
    };
  }, [error, isError, toast]);

  return mutationResult;
};

export { useDownloadDataset };
