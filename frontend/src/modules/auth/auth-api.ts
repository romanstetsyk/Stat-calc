import type {
  RefreshTokenResponseDTO,
  SignInRequestDTO,
  SignInResponseDTO,
  SignUpRequestDTO,
  SignUpResponseDTO,
  UserInfo,
} from '@shared/build/esm/index';
import {
  API_PATHS,
  API_PATHS_AUTH,
  HTTP_METHODS,
} from '@shared/build/esm/index';

import { config } from '~/config';
import { ApiBase } from '~/framework/api';
import type { HttpBase } from '~/framework/http';
import { http } from '~/framework/http';
import { storage } from '~/framework/storage';

class AuthApi extends ApiBase {
  public constructor({
    baseUrl,
    prefix,
    http,
  }: {
    baseUrl: string;
    prefix: string[];
    http: HttpBase;
  }) {
    super({ baseUrl, prefix, http });
  }

  public async signUp(payload: SignUpRequestDTO): Promise<SignUpResponseDTO> {
    const res = await this.load(this.constructURL(API_PATHS_AUTH.SIGN_UP), {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(payload),
      credentials: 'include',
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return res.json();
  }

  public async signIn(payload: SignInRequestDTO): Promise<SignInResponseDTO> {
    const res = await this.load(this.constructURL(API_PATHS_AUTH.SIGN_IN), {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(payload),
      credentials: 'include',
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return res.json();
  }

  public async signOut(): Promise<string> {
    const res = await this.load(this.constructURL(API_PATHS_AUTH.SIGN_OUT), {
      method: HTTP_METHODS.GET,
      credentials: 'include',
    });
    return res.text(); // no body to parse as json for code 204
  }

  public async currentUser(): Promise<UserInfo> {
    const accessToken = storage.get('token');

    const headers = new Headers({ 'Content-Type': 'application/json' });
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const res = await this.load(this.constructURL(API_PATHS_AUTH.ME), {
      method: HTTP_METHODS.GET,
      headers,
    });
    return res.json();
  }

  public async refresh(): Promise<RefreshTokenResponseDTO> {
    const res = await this.load(this.constructURL(API_PATHS_AUTH.REFRESH), {
      method: HTTP_METHODS.GET,
      credentials: 'include',
    });
    return res.json();
  }
}

const authApi = new AuthApi({
  baseUrl: config.API_BASE_URL,
  prefix: [config.API_PREFIX, config.API_VERSION, API_PATHS.AUTH],
  http,
});

export { authApi };
