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

  private refreshPromise: Promise<RefreshTokenResponseDTO> | null;

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

    this.refreshPromise = null;
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

  private async handleRefresh(
    refreshPromise: Promise<RefreshTokenResponseDTO>,
  ): Promise<void> {
    try {
      const { accessToken } = await refreshPromise;
      this.storage.setItem('token', accessToken);
    } finally {
      this.refreshPromise = null;
    }
  }

  private async reqFn(params: {
    url: URL;
    options: HttpApiOptions;
  }): Promise<void> {
    if (this.refreshPromise) {
      await this.handleRefresh(this.refreshPromise);
      return;
    }

    const accessToken = this.storage.getItem('token');
    if (!accessToken) {
      return;
    }

    if (this.tokenUtil.isExpired(accessToken)) {
      this.refreshPromise = this.refresh(params.options.signal);
      await this.handleRefresh(this.refreshPromise);
    }
  }

  private async resFn(
    params: Parameters<NonNullable<Interceptors['response']>>[0],
  ): ReturnType<NonNullable<Interceptors['response']>> {
    if (params.response.status !== HTTP_CODES.UNAUTHORIZED) {
      return;
    }

    if (!this.refreshPromise) {
      this.refreshPromise = this.refresh(params.options.signal);
    }

    await this.handleRefresh(this.refreshPromise);
    params.response = await this.load(params);
  }
}

export { RefreshTokenInterceptor };
