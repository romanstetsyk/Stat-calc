import type { HTTP_METHODS, ValueOf } from '@shared/build/esm/index';

type Http = {
  makeRequest: (url: URL, options: HttpOptions) => Promise<Response>;
};

type HttpOptions = {
  method: ValueOf<typeof HTTP_METHODS>;
  body?: RequestInit['body'];
  headers?: RequestInit['headers'];
  credentials?: RequestInit['credentials'];
  signal?: RequestInit['signal'];
};

export type { Http, HttpOptions };
