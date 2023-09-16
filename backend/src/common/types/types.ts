import type { HttpError } from '~/packages/http-error/http-error.js';

type ValueOf<T> = T[keyof T];

type Override<T, R> = Omit<T, keyof R> & R;

type ErrorCommon = {
  message: HttpError['message'];
};

type Service<T = unknown> = {
  findAll(): Promise<T[]>;
  findById(id: string | number): Promise<T>;
  create(body: unknown): Promise<T>;
};

type Repository<T = unknown> = {
  findAll(): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
};

export type { ErrorCommon, Override, Repository, Service, ValueOf };
