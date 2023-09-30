const STORAGE_KEY = {
  TOKEN: 'token',
} as const;

type Storage = {
  set(key: string, value: unknown): void;
  get(key: string): string | null;
  drop(key: string): void;
  has(key: string): boolean;
};

export type { Storage };
export { STORAGE_KEY };
