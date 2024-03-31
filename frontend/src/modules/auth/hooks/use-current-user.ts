import type { ToastId } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import type { ErrorCommon, UserInfo } from '@shared/build/esm/index';
import { TIME_CONVERT } from '@shared/build/esm/index';
import type { UseQueryResult } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';

import { QUERY_KEY } from '~/common/constants';
import { useQuery, useQueryClient } from '~/common/hooks';
import { config } from '~/config';
import { storage } from '~/framework/storage';

import { authApi } from '../api';

const useCurrentUser = (): UseQueryResult<UserInfo, ErrorCommon> => {
  const queryClient = useQueryClient();

  const accessToken = useMemo(() => storage.getItem('token'), []);

  const staleTime =
    config.VITE_JWT_ACCESS_EXPIRATION_MINUTES * TIME_CONVERT.MIN_TO_MS;

  const queryResult = useQuery<UserInfo, ErrorCommon>({
    queryKey: QUERY_KEY.CURRENT_USER,
    queryFn: authApi.currentUser.bind(authApi),
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: Boolean(accessToken),
    placeholderData: () => {
      return queryClient.getQueryData<UserInfo>(QUERY_KEY.CURRENT_USER);
    },
    staleTime,
  });

  const toast = useToast();
  const toastRef = useRef<ToastId>();

  const { isError, error } = queryResult;

  useEffect(() => {
    if (isError) {
      storage.removeItem('token');
      queryClient.removeQueries({ queryKey: QUERY_KEY.CURRENT_USER });
    }
  }, [isError, queryClient]);

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

export { useCurrentUser };
