type SignUpRequestDTO = {
  name: string;
  email: string;
  password: string;
};

type SignUpResponseDTO = {
  accessToken: string;
};

type SignInRequestDTO = {
  email: string;
  password: string;
};

type SignInResponseDTO = {
  accessToken: string;
};

type RefreshTokenResponseDTO = {
  accessToken: string;
};

export type {
  RefreshTokenResponseDTO,
  SignInRequestDTO,
  SignInResponseDTO,
  SignUpRequestDTO,
  SignUpResponseDTO,
};
