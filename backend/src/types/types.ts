import type { HttpError } from '~/exceptions/exceptions.js';

type ValueOf<T> = T[keyof T];

type Override<T, R> = Omit<T, keyof R> & R;

type ErrorCommon = {
  message: HttpError['message'];
};

type Service<T = unknown> = {
  findAll(): Promise<T[]>;
  findById(id: string | number): Promise<T>;
};

type Repository<T = unknown> = {
  findAll(): Promise<T[]>;
  findById(id: string | number): Promise<T>;
};

export type { ErrorCommon, Override, Repository, Service, ValueOf };
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
