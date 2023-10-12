type UserWithTokens = {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
};

type SignUpRequestDTO = {
  name: string;
  email: string;
  password: string;
};

type SignUpResponseDTO = Omit<UserWithTokens, 'refreshToken'>;

export type { SignUpRequestDTO, SignUpResponseDTO };
