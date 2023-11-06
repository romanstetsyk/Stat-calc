import type { ToastId } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import type {
  ErrorCommon,
  SignInRequestDTO,
  SignInResponseDTO,
} from '@shared/build/esm/index';
import type { UseMutationResult } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useAppMutation } from '~/common/hooks';
import { storage } from '~/framework/storage';

import { authApi } from '../auth-api';

type UseSignIn = () => UseMutationResult<
  SignInResponseDTO,
  ErrorCommon,
  SignInRequestDTO
>;

const useSignIn: UseSignIn = () => {
  const mutationResult = useAppMutation<
    SignInResponseDTO,
    ErrorCommon,
    SignInRequestDTO
  >(['signIn'], authApi.signIn.bind(authApi));

  const toast = useToast();
  const toastRef = useRef<ToastId>();

  const { isError, error, isSuccess, data } = mutationResult;

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
  }, [error?.message, isError, toast]);

  if (isSuccess) {
    storage.set('token', data.accessToken);
  }

  return mutationResult;
};

export { useSignIn };
