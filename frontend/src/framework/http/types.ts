import type { HTTP_METHODS, ValueOf } from 'shared/build/esm';

type Http = {
  makeRequest: (url: URL, options: HttpOptions) => Promise<Response>;
};

type HttpOptions = {
  method: ValueOf<typeof HTTP_METHODS>;
  payload?: RequestInit['body'];
  headers: RequestInit['headers'];
  credentials?: RequestInit['credentials'];
};

export type { Http, HttpOptions };
