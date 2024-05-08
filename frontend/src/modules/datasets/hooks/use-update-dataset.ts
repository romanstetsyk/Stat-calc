import type { ToastId } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import type {
  DatasetDTO,
  DatasetUpdateOneRequestDTO,
  DatasetUpdateOneResponseDTO,
  ErrorCommon,
} from '@shared/build/esm/index';
import type { UseMutationResult } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { MUTATION_KEY } from '~/common/constants';
import { useMutation } from '~/common/hooks';

import { datasetApi } from '../api';

type UseUpload = (
  id: DatasetDTO['id'],
) => UseMutationResult<
  DatasetUpdateOneResponseDTO,
  ErrorCommon,
  DatasetUpdateOneRequestDTO
>;

const useUpdateDataset: UseUpload = (id: DatasetDTO['id']) => {
  const mutationResult = useMutation<
    DatasetUpdateOneResponseDTO,
    ErrorCommon,
    DatasetUpdateOneRequestDTO
  >({
    mutationKey: MUTATION_KEY.UPDATE_FILE,
    mutationFn: datasetApi.updateOne.bind(datasetApi, { id }),
  });

  const toast = useToast();
  const toastRef = useRef<ToastId>();

  const { isError, error } = mutationResult;

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

export { useUpdateDataset };
