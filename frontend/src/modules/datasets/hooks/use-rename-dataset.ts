import type { ToastId } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import type {
  DatasetFindAllResponseDTO,
  DatasetRenameRequestDTO,
  DatasetRenameResponseDTO,
  DatasetRenameURLParams,
  ErrorCommon,
} from '@shared/build/esm/index';
import type { UseMutationResult } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { MUTATION_KEY, QUERY_KEY } from '~/common/constants';
import { useMutation, useQueryClient } from '~/common/hooks';

import { datasetApi } from '../api';

type UseRenameDataset = (
  id: DatasetRenameURLParams['id'],
) => UseMutationResult<
  DatasetRenameResponseDTO,
  ErrorCommon,
  DatasetRenameRequestDTO
>;

const useRenameDataset: UseRenameDataset = (
  id: DatasetRenameURLParams['id'],
) => {
  const queryClient = useQueryClient();

  const mutationResult = useMutation<
    DatasetRenameResponseDTO,
    ErrorCommon,
    DatasetRenameRequestDTO
  >({
    mutationKey: MUTATION_KEY.RENAME_FILE,
    mutationFn: datasetApi.rename.bind(datasetApi, { id }),
  });

  const toast = useToast();
  const toastRef = useRef<ToastId>();

  const { isError, error, isSuccess, data } = mutationResult;

  useEffect(() => {
    if (isSuccess) {
      void queryClient.setQueryData<DatasetFindAllResponseDTO>(
        QUERY_KEY.ALL_DATASETS,
        (old) =>
          old
            ? old.map((oldDataset) =>
                oldDataset.id === data.id ? data : oldDataset,
              )
            : old,
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

export { useRenameDataset };
