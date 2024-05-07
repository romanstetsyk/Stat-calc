import type { ToastId } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import type {
  DatasetFindAllResponseDTO,
  DatasetUploadRequestDTO,
  DatasetUploadResponseDTO,
  ErrorCommon,
} from '@shared/build/esm/index';
import type { UseMutationResult } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { MUTATION_KEY, QUERY_KEY } from '~/common/constants';
import { useMutation, useQueryClient } from '~/common/hooks';

import { datasetApi } from '../api';

type UseUpload = () => UseMutationResult<
  DatasetUploadResponseDTO,
  ErrorCommon,
  DatasetUploadRequestDTO
>;

const useUpload: UseUpload = () => {
  const queryClient = useQueryClient();

  const mutationResult = useMutation<
    DatasetUploadResponseDTO,
    ErrorCommon,
    DatasetUploadRequestDTO
  >({
    mutationKey: MUTATION_KEY.UPLOAD_FILE,
    mutationFn: datasetApi.upload.bind(datasetApi),
  });

  const toast = useToast();
  const toastRef = useRef<ToastId>();

  const { isError, error, isSuccess, data } = mutationResult;

  useEffect(() => {
    if (isSuccess) {
      void queryClient.setQueryData<DatasetFindAllResponseDTO>(
        QUERY_KEY.ALL_DATASETS,
        (old) => (old ? [...old, data] : old),
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

export { useUpload };
