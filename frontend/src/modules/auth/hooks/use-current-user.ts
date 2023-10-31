import type { UserInfo } from '@shared/build/esm/index';
import { ERROR_MESSAGES, TIME_CONVERT } from '@shared/build/esm/index';

import { useAppQuery } from '~/common/hooks';
import { config } from '~/config';
import { storage } from '~/framework/storage';

import { authApi } from '../auth-api';

const useCurrentUser = (): ReturnType<typeof useAppQuery<UserInfo | null>> => {
  const accessToken = storage.get('token');

  const currentUserQuery = useAppQuery(
    ['currentUser'],
    authApi.currentUser.bind(authApi),
    {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime:
        config.VITE_JWT_ACCESS_EXPIRATION_MINUTES * TIME_CONVERT.MIN_TO_MS,
      enabled: Boolean(accessToken),
      placeholderData: null,
    },
  );

  const shouldRefresh =
    currentUserQuery.error instanceof Error &&
    currentUserQuery.error.message === ERROR_MESSAGES.TOKEN_EXPIRED;

  const refreshQuery = useAppQuery(['refresh'], authApi.refresh.bind(authApi), {
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

  return currentUserQuery;
};

export { useCurrentUser };
