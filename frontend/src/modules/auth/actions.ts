import type {
  ErrorCommon,
  SignUpRequestDTO,
  SignUpResponseDTO,
} from '@shared/build/esm/index';
import { ERROR_MESSAGES } from '@shared/build/esm/index';

import { useAppMutation, useAppQuery } from '~/common/hooks';
import { storage } from '~/framework/storage/storage';

import { authApi } from './auth-api';

const signUp = function useSignUp(): ReturnType<
  typeof useAppMutation<SignUpResponseDTO, ErrorCommon, SignUpRequestDTO>
> {
  return useAppMutation(['signUp'], authApi.signUp.bind(authApi));
};

const getCurrentUser = function useGetCurrentUser(): ReturnType<
  typeof useAppQuery<{ name: string; email: string }>
> {
  const currentUserQuery = useAppQuery(
    ['me'],
    authApi.currentUser.bind(authApi),
    {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 60_000,
    },
  );

  const shouldRefresh =
    currentUserQuery.error instanceof Error &&
    currentUserQuery.error.message === ERROR_MESSAGES.TOKEN_EXPIRED;

  const refr = useAppQuery(['refresh'], authApi.refresh.bind(authApi), {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: shouldRefresh,
  });

  if (refr.isSuccess && storage.get('token') !== refr.data.accessToken) {
    storage.set('token', refr.data.accessToken);
    void currentUserQuery.refetch();
  }

  return currentUserQuery;
};

export { getCurrentUser, signUp };
