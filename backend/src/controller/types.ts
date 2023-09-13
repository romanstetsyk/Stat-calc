import type { RequestHandler } from 'express';

import type { HTTP_CODES, HTTP_METHODS } from '~/constants/constants.js';
import type { Override, ValueOf } from '~/types/types.js';

type DefaultRequestOption = {
  body?: Parameters<RequestHandler>[0]['body'];
  query?: Parameters<RequestHandler>[0]['query'];
  params?: Parameters<RequestHandler>[0]['params'];
  headers?: Parameters<RequestHandler>[0]['headers'];
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
};

type RequestHandlerWrapped<
  T extends DefaultRequestOption = DefaultRequestOption,
  R = unknown,
> = RequestHandler<T['params'], R, T['body'], T['query']>;

type ControllerRoute = {
  path: string;
  method: ValueOf<typeof HTTP_METHODS>;
  // WRONG: handler: (options) => Promise<...>
  handler(options: ApiRequest<DefaultRequestOption>): Promise<ApiResponse>;
};

type ApiRequest<T> = Override<DefaultRequestOption, T>;

type ApiResponse<T = unknown> = {
  status: ValueOf<typeof HTTP_CODES>;
  payload: T;
};

export type {
  ApiRequest,
  ApiResponse,
  Controller,
  ControllerRoute,
  RequestHandlerWrapped,
  ServerApi,
  ServerRoute,
};
