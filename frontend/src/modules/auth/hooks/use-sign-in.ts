import type {
  ErrorCommon,
  SignInRequestDTO,
  SignInResponseDTO,
} from '@shared/build/esm/index';

import { useAppMutation } from '~/common/hooks';

import { authApi } from '../auth-api';

const useSignIn = (): ReturnType<
  typeof useAppMutation<SignInResponseDTO, ErrorCommon, SignInRequestDTO>
> => {
  return useAppMutation(['signIn'], authApi.signIn.bind(authApi));
};

export { useSignIn };
