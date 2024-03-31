import type { ToastId } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import type {
  DatasetDeleteResponseDTO,
  DatasetDeleteURLParams,
  DatasetFindAllResponseDTO,
  ErrorCommon,
} from '@shared/build/esm/index';
import type { UseMutationResult } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { MUTATION_KEY, QUERY_KEY } from '~/common/constants';
import { useMutation, useQueryClient } from '~/common/hooks';

import { datasetApi } from '../api';

type UseDeleteDataset = () => UseMutationResult<
  DatasetDeleteResponseDTO,
  ErrorCommon,
  DatasetDeleteURLParams
>;

const useDeleteDataset: UseDeleteDataset = () => {
  const queryClient = useQueryClient();

  const mutationResult = useMutation<
    DatasetDeleteResponseDTO,
    ErrorCommon,
    { id: string }
  >({
    mutationKey: MUTATION_KEY.DELETE_FILE,
    mutationFn: datasetApi.delete.bind(datasetApi),
  });

  const toast = useToast();
  const toastRef = useRef<ToastId>();

  const { isError, error, isSuccess, data } = mutationResult;

  useEffect(() => {
    if (isSuccess && data !== null) {
      void queryClient.setQueryData(
        QUERY_KEY.ALL_DATASETS,
        (old: DatasetFindAllResponseDTO): DatasetFindAllResponseDTO => {
          return old.filter(({ id }) => id !== data.id);
        },
      );
    }
  }, [data, isSuccess, queryClient]);

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

export { useDeleteDataset };
