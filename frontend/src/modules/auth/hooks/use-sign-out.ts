import type { ErrorCommon } from '@shared/build/esm/index';
import type { UseQueryResult } from '@tanstack/react-query';

import { useAppQuery, useQueryClient } from '~/common/hooks';
import { storage } from '~/framework/storage';

import { authApi } from '../auth-api';

type UseSignOut = () => UseQueryResult<string, ErrorCommon> & {
  invalidateCurrentUser: () => void;
};

const useSignOut: UseSignOut = () => {
  const queryClient = useQueryClient();

  const invalidateCurrentUser = (): void => {
    storage.drop('token');
    queryClient.removeQueries(['currentUser']);
  };

  const signOutQuery = useAppQuery<string, ErrorCommon>(
    ['signOut'],
    authApi.signOut.bind(authApi),
    {
      enabled: false,
    },
  );

  return { ...signOutQuery, invalidateCurrentUser };
};

export { useSignOut };
