import type { UserEntity } from '~/users/user.entity.js';

type SignUpRequestDTO = {
  name: string;
  email: string;
  password: string;
};

type SignUpResponseDTO = {
  id: UserEntity['id'];
  email: UserEntity['email'];
  token: string;
};

export type { SignUpRequestDTO, SignUpResponseDTO };
