import type { HttpError } from '~/exceptions/exceptions.js';

type ValueOf<T> = T[keyof T];

type Override<T, R> = Omit<T, keyof R> & R;

type ErrorCommon = {
  message: HttpError['message'];
};

export type { ErrorCommon, Override, ValueOf };
export type {
  ApiRequest,
  ApiResponse,
  Controller,
  ControllerRoute,
  RequestHandlerWrapped,
  ServerApi,
  ServerRoute,
} from '~/controller/types.js';
export type {
  FindAllResponseDTO,
  FindByIdRequestDTO,
  FindByIdResponseDTO,
  UserEntity,
} from '~/users/types.js';
