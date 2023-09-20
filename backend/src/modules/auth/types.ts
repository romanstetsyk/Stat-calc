import type { UserEntity } from '~/modules/users/user.entity.js';

type SignUpRequestDTO = {
  name: string;
  email: string;
  password: string;
};

type SignInRequestDTO = {
  email: string;
  password: string;
};

type SignUpResponseDTO = {
  message: string;
};

type UserWithTokens = {
  id: UserEntity['id'];
  email: UserEntity['email'];
  accessToken: string;
  refreshToken: string;
};

type SignInResponseDTO = Omit<UserWithTokens, 'refreshToken'>;

export type {
  SignInRequestDTO,
  SignInResponseDTO,
  SignUpRequestDTO,
  SignUpResponseDTO,
  UserWithTokens,
};
