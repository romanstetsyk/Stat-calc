import type {
  SignUpRequestDTO,
  SignUpResponseDTO,
} from '@shared/build/esm/index';
import {
  API_PATHS,
  API_PATHS_AUTH,
  ERROR_MESSAGES,
  HTTP_CODES,
  HTTP_METHODS,
  HttpError,
} from '@shared/build/esm/index';

import { config } from '~/config';
import { ApiBase } from '~/framework/api';
import type { HttpBase } from '~/framework/http';
import { http } from '~/framework/http';
import { storage } from '~/framework/storage/storage';

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
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    const res = await this.load(this.constructURL(API_PATHS_AUTH.SIGN_UP), {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(payload),
      credentials: 'include',
      headers,
    });
    return res.json();
  }

  public async currentUser(): Promise<{ name: string; email: string }> {
    const accessToken = storage.get('token');

    if (!accessToken) {
      throw new HttpError({
        status: HTTP_CODES.UNAUTHORIZED,
        message: ERROR_MESSAGES.MISSING_TOKEN,
      });
    }

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Authorization', `Bearer ${accessToken}`);

    const res = await this.load(this.constructURL(API_PATHS_AUTH.ME), {
      method: HTTP_METHODS.GET,
      headers,
    });
    return res.json();
  }

  public async refresh(): Promise<{ accessToken: string }> {
    const res = await this.load(this.constructURL(API_PATHS_AUTH.REFRESH), {
      credentials: 'include',
      method: HTTP_METHODS.GET,
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
