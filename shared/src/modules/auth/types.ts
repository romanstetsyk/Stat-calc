type SignUpRequestDTO = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
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
