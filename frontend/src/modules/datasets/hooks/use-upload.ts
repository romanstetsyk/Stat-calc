import type { ToastId } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import type {
  DatasetUploadRequestDTO,
  ErrorCommon,
} from '@shared/build/esm/index';
import type { UseMutationResult } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useMutation, useQueryClient } from '~/common/hooks';

import { datasetApi } from '../api';

type UseUpload = () => UseMutationResult<
  string,
  ErrorCommon,
  DatasetUploadRequestDTO
>;

const useUpload: UseUpload = () => {
  const queryClient = useQueryClient();

  const mutationResult = useMutation<
    string,
    ErrorCommon,
    DatasetUploadRequestDTO
  >({
    mutationKey: ['uploadFile'],
    mutationFn: datasetApi.upload.bind(datasetApi),
  });

  const toast = useToast();
  const toastRef = useRef<ToastId>();

  const { isError, error, isSuccess } = mutationResult;

  useEffect(() => {
    if (isSuccess) {
      void queryClient.refetchQueries({ queryKey: ['allDatasets'] });
    }
  }, [isSuccess, queryClient]);

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
