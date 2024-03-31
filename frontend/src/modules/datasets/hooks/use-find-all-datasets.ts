import type { ToastId } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import type {
  DatasetFindAllResponseDTO,
  ErrorCommon,
} from '@shared/build/esm/index';
import type { UseQueryResult } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useQuery } from '~/common/hooks';

import { datasetApi } from '../api';

const useFindAllDatasets = (): UseQueryResult<
  DatasetFindAllResponseDTO,
  ErrorCommon
> => {
  const queryResult = useQuery<DatasetFindAllResponseDTO, ErrorCommon>({
    queryKey: ['allDatasets'],
    queryFn: ({ signal }) => datasetApi.findAll(signal),
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  const toast = useToast();
  const toastRef = useRef<ToastId>();

  const { isError, error } = queryResult;

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

  return queryResult;
};

export { useFindAllDatasets };
