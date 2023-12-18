import type {
  RefreshTokenResponseDTO,
  SignInRequestDTO,
  SignInResponseDTO,
  SignUpRequestDTO,
  SignUpResponseDTO,
  UserInfo,
} from '@shared/build/esm/index';
import {
  ACCEPT,
  API_PATHS_AUTH,
  CONTENT_TYPE,
  HTTP_METHODS,
} from '@shared/build/esm/index';

import type { HttpResponseInterceptorFn } from '~/framework/api';
import { ApiBase } from '~/framework/api';
import type { HttpBase } from '~/framework/http';
import type { Storage } from '~/framework/storage';

class AuthApi extends ApiBase {
  public constructor({
    baseUrl,
    prefix,
    http,
    storage,
  }: {
    baseUrl: string;
    prefix: string[];
    http: HttpBase;
    storage: Storage;
  }) {
    super({ baseUrl, prefix, http, storage });
  }

  public async signUp(payload: SignUpRequestDTO): Promise<SignUpResponseDTO> {
    const res = await this.load({
      url: this.constructURL(API_PATHS_AUTH.SIGN_UP),
      options: {
        method: HTTP_METHODS.POST,
        payload: JSON.stringify(payload),
        credentials: 'include',
        headers: {
          contentType: CONTENT_TYPE.JSON,
          accept: ACCEPT.JSON,
        },
      },
    });
    return res.json();
  }

  public async signIn(payload: SignInRequestDTO): Promise<SignInResponseDTO> {
    const res = await this.load({
      url: this.constructURL(API_PATHS_AUTH.SIGN_IN),
      options: {
        method: HTTP_METHODS.POST,
        payload: JSON.stringify(payload),
        credentials: 'include',
        headers: {
          contentType: CONTENT_TYPE.JSON,
          accept: ACCEPT.JSON,
        },
      },
    });
    return res.json();
  }

  public async signOut(): Promise<string> {
    const res = await this.load({
      url: this.constructURL(API_PATHS_AUTH.SIGN_OUT),
      options: {
        method: HTTP_METHODS.GET,
        credentials: 'include',
        headers: {
          accept: ACCEPT.TEXT,
        },
      },
    });
    return res.text(); // no body to parse as json for code 204
  }

  public async currentUser(signal?: RequestInit['signal']): Promise<UserInfo> {
    const res = await this.load({
      url: this.constructURL(API_PATHS_AUTH.ME),
      options: {
        method: HTTP_METHODS.GET,
        hasAuth: true,
        signal,
        headers: {
          accept: ACCEPT.JSON,
        },
      },
      onError: {
        fn: this.refresh.bind(this),
        repeatOriginalRequestOnSuccess: true,
      },
    });
    return res.json();
  }

  private refresh: HttpResponseInterceptorFn = async ({ signal }) => {
    const res = await this.load({
      url: this.constructURL(API_PATHS_AUTH.REFRESH),
      options: {
        method: HTTP_METHODS.GET,
        credentials: 'include',
        hasAuth: false,
        signal,
      },
    });
    const json: RefreshTokenResponseDTO = await res.json();
    this.storage.setItem('token', json.accessToken);
  };
}

export { AuthApi };
