import type {
  ErrorCommon,
  HTTP_CODES,
  ValueOf,
} from '@shared/build/esm/index.js';
import {
  AUTH_SCHEMA,
  HTTP_HEADERS,
  HttpError,
} from '@shared/build/esm/index.js';

import type { HttpBase, HttpOptions } from '~/framework/http';
import type { Storage } from '~/framework/storage';

import type { HttpApiOptions, Interceptors } from './types';

type ApiBaseConstructor = {
  baseUrl: string;
  prefix: string[];
  http: HttpBase;
  storage: Storage;
};

abstract class ApiBase {
  private baseUrl: string;
  private prefix: string[];
  private http: HttpBase;
  protected storage: Storage;

  protected interceptors: Interceptors = {};

  protected constructor({
    baseUrl,
    prefix,
    http,
    storage,
  }: ApiBaseConstructor) {
    this.baseUrl = baseUrl;
    this.prefix = prefix;
    this.http = http;
    this.storage = storage;
  }

  public async load(reqParams: {
    url: URL;
    options: HttpApiOptions;
  }): Promise<Response> {
    if (!reqParams.options.ignoreInterceptors && this.interceptors.request) {
      await this.interceptors.request(reqParams);
    }

    const fetchOptions: HttpOptions = {
      body: reqParams.options.payload,
      method: reqParams.options.method,
      credentials: reqParams.options.credentials,
      signal: reqParams.options.signal,
      headers: this.setHeaders(
        reqParams.options.hasAuth,
        reqParams.options.headers,
      ),
    };

    const response = await this.http.makeRequest(reqParams.url, fetchOptions);

    const resParams = {
      response,
      url: reqParams.url,
      options: reqParams.options,
    };

    if (!reqParams.options.ignoreInterceptors && this.interceptors.response) {
      await this.interceptors.response(resParams);
    }

    if (!resParams.response.ok) {
      await this.handleError(resParams.response);
    }
    return resParams.response;
  }

  private setHeaders(
    hasAuth: HttpApiOptions['hasAuth'],
    headersObj: HttpApiOptions['headers'],
  ): Headers {
    const { contentType, accept } = headersObj ?? {};

    const headers = new Headers();

    if (hasAuth) {
      headers.set(
        HTTP_HEADERS.AUTHORIZATION,
        `${AUTH_SCHEMA} ${this.storage.getItem('token')}`,
      );
    }

    if (contentType) {
      headers.set(HTTP_HEADERS.CONTENT_TYPE, contentType);
    }

    if (accept) {
      headers.set(HTTP_HEADERS.ACCEPT, accept);
    }

    return headers;
  }

  private async handleError(res: Response): Promise<never> {
    const { message }: ErrorCommon = await res.json();
    const status = res.status as ValueOf<typeof HTTP_CODES>;
    throw new HttpError({ message, status, cause: res });
  }

  protected constructURL(
    path: string,
    options: { params?: Record<string, string> } = {},
  ): URL {
    const { params = {} } = options;
    const pathWithParams = this.parseURLParams(path, params);

    return new URL([...this.prefix, pathWithParams].join(''), this.baseUrl);
  }

  private parseURLParams(path: string, params: Record<string, string>): string {
    let pathCopy = path;
    for (const [key, value] of Object.entries(params)) {
      pathCopy = pathCopy.replace(`:${key}`, value);
    }
    return pathCopy;
  }
}

export type { ApiBaseConstructor };
export { ApiBase };
