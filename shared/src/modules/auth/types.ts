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

export type {
  SignInRequestDTO,
  SignInResponseDTO,
  SignUpRequestDTO,
  SignUpResponseDTO,
};
