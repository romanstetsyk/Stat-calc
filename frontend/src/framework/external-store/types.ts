type TExternalStore<T> = {
  subscribe(listener: () => void): () => void;
  getSnapshot(): T;
};

export type { TExternalStore };
