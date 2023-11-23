import type { ACCEPT, CONTENT_TYPE, ValueOf } from '@shared/build/esm/index';

import type { HttpOptions } from '~/framework/http';

type HttpApiOptions = Omit<HttpOptions, 'headers' | 'body'> & {
  headers?: {
    contentType?: ValueOf<typeof CONTENT_TYPE>;
    accept?: ValueOf<typeof ACCEPT>;
  };
  hasAuth?: boolean; // refers to authorization header
  payload?: HttpOptions['body'];
};

type HttpResponseInterceptorFn = ({
  response,
  signal,
}: {
  response?: Response;
  signal?: RequestInit['signal'];
}) => Promise<void>;

type HttpResponseInterceptor = {
  fn: HttpResponseInterceptorFn;
  repeatOriginalRequestOnSuccess?: boolean;
};

export type {
  HttpApiOptions,
  HttpResponseInterceptor,
  HttpResponseInterceptorFn,
};
