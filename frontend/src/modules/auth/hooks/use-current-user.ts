import type { ErrorCommon, UserInfo } from '@shared/build/esm/index';
import { ERROR_MESSAGES, TIME_CONVERT } from '@shared/build/esm/index';
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery, useQueryClient } from '~/common/hooks';
import { config } from '~/config';
import { storage } from '~/framework/storage';

import { authApi } from '../auth-api';

const useCurrentUser = (): UseQueryResult<UserInfo | null, ErrorCommon> => {
  const queryClient = useQueryClient();

  const accessToken = storage.get('token');

  const currentUserQuery = useQuery<UserInfo | null, ErrorCommon>({
    queryKey: ['currentUser'],
    queryFn: authApi.currentUser.bind(authApi),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime:
      config.VITE_JWT_ACCESS_EXPIRATION_MINUTES * TIME_CONVERT.MIN_TO_MS,
    enabled: Boolean(accessToken),
    placeholderData: null,
  });

  const shouldRefresh =
    Boolean(accessToken) &&
    currentUserQuery.error instanceof Error &&
    currentUserQuery.error.message === ERROR_MESSAGES.TOKEN_EXPIRED;

  const refreshQuery = useQuery({
    queryKey: ['refresh'],
    queryFn: authApi.refresh.bind(authApi),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: shouldRefresh,
  });

  if (
    refreshQuery.isSuccess &&
    storage.get('token') !== refreshQuery.data.accessToken
  ) {
    storage.set('token', refreshQuery.data.accessToken);
    void currentUserQuery.refetch();
  }

  if (refreshQuery.isError) {
    storage.drop('token');
    queryClient.removeQueries({ queryKey: ['currentUser'] });
  }

  return currentUserQuery;
};

export { useCurrentUser };
