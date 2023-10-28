import type { UserEntity } from '~/modules/users/user.entity.js';

type UserWithTokens = {
  userId: UserEntity['id'];
  accessToken: string;
  refreshToken: string;
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type RefreshTokenResponseDTO = {
  accessToken: string;
};

export type { RefreshTokenResponseDTO, Tokens, UserWithTokens };
