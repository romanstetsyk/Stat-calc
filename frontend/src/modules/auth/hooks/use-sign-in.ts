import type { ToastId } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import type {
  ErrorCommon,
  SignInRequestDTO,
  SignInResponseDTO,
} from '@shared/build/esm/index';
import type { UseMutationResult } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useMutation, useQueryClient } from '~/common/hooks';
import { storage } from '~/framework/storage';

import { authApi } from '../api';

type UseSignIn = () => UseMutationResult<
  SignInResponseDTO,
  ErrorCommon,
  SignInRequestDTO
>;

const useSignIn: UseSignIn = () => {
  const queryClient = useQueryClient();

  const mutationResult = useMutation<
    SignInResponseDTO,
    ErrorCommon,
    SignInRequestDTO
  >({ mutationKey: ['signIn'], mutationFn: authApi.signIn.bind(authApi) });

  const toast = useToast();
  const toastRef = useRef<ToastId>();

  const { isError, error, isSuccess, data } = mutationResult;

  useEffect(() => {
    if (isSuccess) {
      storage.setItem('token', data.accessToken);
      void queryClient.fetchQuery({ queryKey: ['currentUser'] });
    }
  }, [data?.accessToken, isSuccess, queryClient]);

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

export { useSignIn };
