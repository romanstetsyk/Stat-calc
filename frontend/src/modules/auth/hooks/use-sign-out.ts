import { useAppQuery, useQueryClient } from '~/common/hooks';
import { storage } from '~/framework/storage';

import { authApi } from '../auth-api';

const useSignOut = (): ReturnType<typeof useAppQuery<string>> & {
  invalidateCurrentUser: () => void;
} => {
  const queryClient = useQueryClient();

  const invalidateCurrentUser = (): void => {
    storage.drop('token');
    queryClient.removeQueries(['currentUser']);
  };

  const signOutQuery = useAppQuery(['signOut'], authApi.signOut.bind(authApi), {
    enabled: false,
  });

  return { ...signOutQuery, invalidateCurrentUser };
};

export { useSignOut };
