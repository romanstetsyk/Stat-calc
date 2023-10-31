import type {
  ErrorCommon,
  SignUpRequestDTO,
  SignUpResponseDTO,
} from '@shared/build/esm/index';

import { useAppMutation } from '~/common/hooks';

import { authApi } from '../auth-api';

const useSignUp = (): ReturnType<
  typeof useAppMutation<SignUpResponseDTO, ErrorCommon, SignUpRequestDTO>
> => {
  return useAppMutation(['signUp'], authApi.signUp.bind(authApi));
};

export { useSignUp };
