import type { ErrorCommon } from '@shared/build/esm/index';
import type { UseQueryResult } from '@tanstack/react-query';

import { useQuery, useQueryClient } from '~/common/hooks';
import { storage } from '~/framework/storage';

import { authApi } from '../auth-api';

type UseSignOut = () => UseQueryResult<string, ErrorCommon>;

const useSignOut: UseSignOut = () => {
  const queryClient = useQueryClient();

  const signOutQuery = useQuery<string, ErrorCommon>({
    queryKey: ['signOut'],
    queryFn: authApi.signOut.bind(authApi),
    enabled: false,
  });

  if (signOutQuery.isSuccess) {
    storage.drop('token');
    queryClient.removeQueries({ queryKey: ['currentUser'] });
    queryClient.removeQueries({ queryKey: ['signOut'] });
  }

  return signOutQuery;
};

export { useSignOut };
