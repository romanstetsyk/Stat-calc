import type { ToastId } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import type { ErrorCommon } from '@shared/build/esm/index';
import { API_PATHS_AUTH } from '@shared/build/esm/index';
import type { UseMutationResult } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useMutation, useNavigate, useQueryClient } from '~/common/hooks';
import { storage } from '~/framework/storage';

import { authApi } from '../api';

type UseSignOut = () => UseMutationResult<string, ErrorCommon, void>;

const useSignOut: UseSignOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const toast = useToast();
  const toastRef = useRef<ToastId>();

  const mutationResult = useMutation<string, ErrorCommon>({
    mutationKey: ['signOut'],
    mutationFn: authApi.signOut.bind(authApi),
    onSuccess: () => {
      storage.removeItem('token');
      queryClient.removeQueries();
      navigate(API_PATHS_AUTH.SIGN_IN);
    },
  });

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

export { useSignOut };
