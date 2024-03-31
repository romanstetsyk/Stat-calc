import type { RefreshTokenResponseDTO } from '@shared/build/esm/index';
import {
  ACCEPT,
  API_PATHS_AUTH,
  HTTP_CODES,
  HTTP_METHODS,
} from '@shared/build/esm/index';

import type {
  ApiBaseConstructor,
  HttpApiOptions,
  Interceptors,
} from '~/framework/api';
import { ApiBase } from '~/framework/api';
import type { TokenUtil } from '~/framework/token-util';

type InterceptorsConstructor = ApiBaseConstructor & { tokenUtil: TokenUtil };

class RefreshTokenInterceptor extends ApiBase implements Interceptors {
  private tokenUtil: TokenUtil;
  public request: Interceptors['request'];
  public response: Interceptors['response'];

  public constructor({
    baseUrl,
    prefix,
    http,
    storage,
    tokenUtil,
  }: InterceptorsConstructor) {
    super({ baseUrl, prefix, http, storage });

    this.tokenUtil = tokenUtil;
    this.request = this.reqFn.bind(this);
    this.response = this.resFn.bind(this);
  }

  private async refresh(
    signal: RequestInit['signal'],
  ): Promise<RefreshTokenResponseDTO> {
    const res = await this.load({
      url: this.constructURL(API_PATHS_AUTH.REFRESH),
      options: {
        method: HTTP_METHODS.GET,
        credentials: 'include',
        hasAuth: false,
        signal,
        headers: {
          accept: ACCEPT.JSON,
        },
      },
    });
    return res.json();
  }

  private async reqFn(params: {
    url: URL;
    options: HttpApiOptions;
  }): Promise<void> {
    const accessToken = this.storage.getItem('token');
    if (!accessToken) {
      // params.options.signal = AbortSignal.abort();
      return;
    }
    if (this.tokenUtil.isExpired(accessToken)) {
      try {
        const { accessToken } = await this.refresh(params.options.signal);
        this.storage.setItem('token', accessToken);
      } catch {
        /* empty */
      }
    }
  }

  private async resFn(
    params: Parameters<NonNullable<Interceptors['response']>>[0],
  ): ReturnType<NonNullable<Interceptors['response']>> {
    const { response, url, options } = params;

    if (response.status !== HTTP_CODES.UNAUTHORIZED) {
      return;
    }

    try {
      const { accessToken } = await this.refresh(options.signal);
      this.storage.setItem('token', accessToken);
      params.response = await this.load({ url, options });
    } catch {
      /* empty */
    }
  }
}

export { RefreshTokenInterceptor };
