import type {
  SignInRequestDTO,
  SignUpRequestDTO,
} from '@shared/build/esm/index';

const DEFAULT_SIGN_IN_PAYLOAD: SignInRequestDTO = {
  email: '',
  password: '',
};

const DEFAULT_SIGN_UP_PAYLOAD: SignUpRequestDTO = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

export { DEFAULT_SIGN_IN_PAYLOAD, DEFAULT_SIGN_UP_PAYLOAD };
