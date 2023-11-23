import type { HTTP_METHODS, ValueOf } from '@shared/build/esm/index';

type Http = {
  makeRequest: (url: URL, options: HttpOptions) => Promise<Response>;
};

type HttpOptions = Pick<
  RequestInit,
  'body' | 'credentials' | 'signal' | 'headers'
> & {
  method: ValueOf<typeof HTTP_METHODS>;
};

export type { Http, HttpOptions };
