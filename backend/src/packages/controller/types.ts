import type { CookieOptions, RequestHandler } from 'express';
import type { HTTP_CODES, HTTP_METHODS, ValueOf } from 'shared/build/index.js';

import type { Override } from '~/common/types/types.js';

type DefaultRequestOption = {
  body?: Parameters<RequestHandler>[0]['body'];
  query?: Parameters<RequestHandler>[0]['query'];
  params?: Parameters<RequestHandler>[0]['params'];
  headers?: Parameters<RequestHandler>[0]['headers'];
  cookies?: Parameters<RequestHandler>[0]['cookies'];
  signedCookies?: Parameters<RequestHandler>[0]['signedCookies'];
  file?: Express.Multer.File;
};

type ServerApi = {
  version: string;
  controllers: Controller[];
};

type Controller = {
  segment: string;
  routes: ServerRoute[];
};

type ServerRoute = {
  path: string;
  method: ValueOf<typeof HTTP_METHODS>;
  handler: RequestHandlerWrapped;
  plugins: RequestHandler[];
};

type RequestHandlerWrapped<
  T extends DefaultRequestOption = DefaultRequestOption,
  R = unknown,
> = RequestHandler<T['params'], R, T['body'], T['query']>;

type ControllerRoute = Pick<ServerRoute, 'path' | 'method'> & {
  // WRONG: handler: (options) => Promise<...>
  handler(options: ApiRequest<DefaultRequestOption>): Promise<ApiResponse>;
  plugins?: ServerRoute['plugins'];
};

type ApiRequest<
  T extends Partial<Record<keyof DefaultRequestOption, unknown>>,
> = Override<DefaultRequestOption, T>;

type AllowedCookies = {
  refreshToken: string;
};

type CookieArray = {
  [C in keyof AllowedCookies]: [C, AllowedCookies[C], CookieOptions]; // [ name, value, options ]
}[keyof AllowedCookies];

type ApiResponse<T = unknown> = {
  status: ValueOf<typeof HTTP_CODES>;
  payload: T | null;
  cookies?: CookieArray[];
  clearCookies?: [CookieArray[0], CookieArray[2]][];
};

export type {
  AllowedCookies,
  ApiRequest,
  ApiResponse,
  Controller,
  ControllerRoute,
  RequestHandlerWrapped,
  ServerApi,
  ServerRoute,
};
