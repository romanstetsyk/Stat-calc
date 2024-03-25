import type { ErrorCommon, UserInfo } from '@shared/build/esm/index';
import { TIME_CONVERT } from '@shared/build/esm/index';
import type { UseQueryResult } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { useQuery, useQueryClient } from '~/common/hooks';
import { config } from '~/config';
import { storage } from '~/framework/storage';

import { authApi } from '../api';

const useCurrentUser = (): UseQueryResult<UserInfo | null, ErrorCommon> => {
  const queryClient = useQueryClient();

  const accessToken = useMemo(() => storage.getItem('token'), []);

  const staleTime =
    config.VITE_JWT_ACCESS_EXPIRATION_MINUTES * TIME_CONVERT.MIN_TO_MS;

  const queryResult = useQuery<UserInfo | null, ErrorCommon>({
    queryKey: ['currentUser'],
    queryFn: ({ signal }) => authApi.currentUser(signal),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: Boolean(accessToken),
    placeholderData: () => {
      return queryClient.getQueryData<UserInfo | null>(['currentUser']);
    },
    staleTime,
  });

  const { isError } = queryResult;

  useEffect(() => {
    if (
      !accessToken &&
      queryClient.getQueryData<UserInfo | null>(['currentUser'])
    ) {
      queryClient.setQueryData<UserInfo | null>(['currentUser'], null);
    }
  }, [accessToken, queryClient]);

  useEffect(() => {
    if (isError) {
      storage.removeItem('token');
      queryClient.setQueryData<UserInfo | null>(['currentUser'], null);
    }
  }, [isError, queryClient]);

  return queryResult;
};

export { useCurrentUser };
