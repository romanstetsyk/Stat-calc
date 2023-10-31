type Override<T, R extends Partial<Record<keyof T, unknown>>> = Omit<
  T,
  keyof R
> &
  R;

type Service<T = unknown> = {
  findAll(): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
  create(body: unknown): Promise<T>;
};

type Repository<T = unknown> = {
  findAll(): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
};

export type { Override, Repository, Service };
