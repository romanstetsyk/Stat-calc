type ExtractOptionalKeys<T> = Exclude<
  {
    [K in keyof T]: T extends Record<K, Exclude<T[K], undefined>> ? never : K;
  }[keyof T],
  undefined
>;

type PickAllOptional<T> = Pick<T, ExtractOptionalKeys<T>>;

/**
 * Make optional properties of T required
 * @param T extends Record<string, unknown>
 * @param K union of optional properties that should be required
 * @example type Test = WithRequired<{ a?: string; b: string }, 'a'>
 * type Test = { a: string; b: string }
 */
type WithRequired<T, K extends keyof PickAllOptional<T>> = T &
  Required<Pick<T, K>>;

export type { WithRequired };
