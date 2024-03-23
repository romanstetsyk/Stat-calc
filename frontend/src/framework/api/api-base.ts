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

import type { HttpBase } from '~/framework/http';
import type { Storage } from '~/framework/storage';

import type { HttpApiOptions, LoadParams } from './types';

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

  public async load({ url, options, onError }: LoadParams): Promise<Response> {
    const {
      headers,
      hasAuth,
      payload: body,
      method,
      credentials,
      signal,
    } = options;

    const response = await this.http.makeRequest(url, {
      body,
      method,
      credentials,
      signal,
      headers: this.setHeaders(hasAuth, headers),
    });

    if (!response.ok) {
      if (onError) {
        try {
          await onError.fn({ response, signal });
          if (onError.repeatOriginalRequestOnSuccess) {
            return await this.load({ url, options });
          }
        } catch {
          /* empty */
        }
      }

      await this.handleError(response);
    }
    return response;
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

  protected constructURL(path: string): URL {
    return new URL([...this.prefix, path].join(''), this.baseUrl);
  }
}

export type { ApiBaseConstructor };
export { ApiBase };
