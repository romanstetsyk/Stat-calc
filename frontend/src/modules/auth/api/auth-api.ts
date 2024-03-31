import type {
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

import type { ApiBaseConstructor, Interceptors } from '~/framework/api';
import { ApiBase } from '~/framework/api';

type AuthApiConstructor = ApiBaseConstructor & { interceptors: Interceptors };

class AuthApi extends ApiBase {
  public constructor({
    baseUrl,
    prefix,
    http,
    storage,
    interceptors,
  }: AuthApiConstructor) {
    super({ baseUrl, prefix, http, storage });

    this.interceptors = interceptors;
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
        ignoreInterceptors: true,
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
        ignoreInterceptors: true,
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

  public async currentUser(): Promise<UserInfo> {
    const res = await this.load({
      url: this.constructURL(API_PATHS_AUTH.ME),
      options: {
        method: HTTP_METHODS.GET,
        hasAuth: true,
        headers: {
          accept: ACCEPT.JSON,
        },
      },
    });
    return res.json();
  }
}

export { AuthApi };
