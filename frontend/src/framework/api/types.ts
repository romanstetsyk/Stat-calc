import type { ACCEPT, CONTENT_TYPE, ValueOf } from '@shared/build/esm/index';

import type { HttpOptions } from '~/framework/http';

type HttpApiOptions = Omit<HttpOptions, 'headers' | 'body'> & {
  headers?: {
    contentType?: ValueOf<typeof CONTENT_TYPE>;
    accept?: ValueOf<typeof ACCEPT>;
  };
  hasAuth?: boolean; // refers to authorization header
  payload?: HttpOptions['body'];
  ignoreInterceptors?: boolean;
};

type Interceptors = {
  request?: (params: { url: URL; options: HttpApiOptions }) => Promise<void>;
  response?: (params: {
    response: Response;
    url: URL;
    options: HttpApiOptions;
  }) => Promise<void>;
};

export type { HttpApiOptions, Interceptors };
