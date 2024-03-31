import { API_PATHS } from '@shared/build/esm/index';

import { config } from '~/config';
import { http } from '~/framework/http';
import { storage } from '~/framework/storage';
import { tokenUtil } from '~/framework/token-util';

import { AuthApi } from './auth-api';
import { RefreshTokenInterceptor } from './refresh-token-interceptor';

const baseUrl = config.API_BASE_URL;
const prefix = [config.API_PREFIX, config.API_VERSION, API_PATHS.AUTH];

const refreshTokenInterceptor = new RefreshTokenInterceptor({
  baseUrl,
  prefix,
  http,
  storage,
  tokenUtil,
});
const authApi = new AuthApi({
  baseUrl,
  prefix,
  http,
  storage,
  interceptors: refreshTokenInterceptor,
});

export { authApi, refreshTokenInterceptor };
