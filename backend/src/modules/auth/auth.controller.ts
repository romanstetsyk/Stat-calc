import type {
  HTTP_HEADERS,
  RefreshTokenResponseDTO,
  SignInRequestDTO,
  SignInResponseDTO,
  SignUpRequestDTO,
  SignUpResponseDTO,
  UserInfo,
} from 'shared/build/index.js';
import {
  API_PATHS_AUTH,
  ERROR_MESSAGES,
  HTTP_CODES,
  HTTP_METHODS,
  HttpError,
  signInSchema,
  signUpSchema,
  TIME_CONVERT,
} from 'shared/build/index.js';

import type { Config } from '~/packages/config/config.js';
import type {
  ApiRequest,
  ApiResponse,
  ControllerBaseConstructor,
} from '~/packages/controller/controller.js';
import { ControllerBase } from '~/packages/controller/controller.js';
import type { AllowedCookies } from '~/packages/controller/types.js';

import type { AuthService } from './auth.service.js';
import type { UserWithTokens } from './types.js';

type AuthControllerConstructor = ControllerBaseConstructor & {
  config: Config;
  authService: AuthService;
};

class AuthController extends ControllerBase {
  private authService: AuthService;
  protected config: Config;

  public constructor({
    segment,
    logger,
    authService,
    config,
  }: AuthControllerConstructor) {
    super({ segment, logger });
    this.authService = authService;
    this.config = config;

    this.addRoute({
      path: API_PATHS_AUTH.SIGN_UP,
      method: HTTP_METHODS.POST,
      handler: this.signUp.bind(this),
    });

    this.addRoute({
      path: API_PATHS_AUTH.SIGN_IN,
      method: HTTP_METHODS.POST,
      handler: this.signIn.bind(this),
    });

    this.addRoute({
      path: API_PATHS_AUTH.REFRESH,
      method: HTTP_METHODS.GET,
      handler: this.refresh.bind(this),
    });

    this.addRoute({
      path: API_PATHS_AUTH.ME,
      method: HTTP_METHODS.GET,
      handler: this.me.bind(this),
    });

    this.addRoute({
      path: API_PATHS_AUTH.SIGN_OUT,
      method: HTTP_METHODS.GET,
      handler: this.signOut.bind(this),
    });
  }

  private async me(
    options: ApiRequest<{ headers: { [HTTP_HEADERS.AUTHORIZATION]?: string } }>,
  ): Promise<ApiResponse<UserInfo>> {
    const { headers } = options;

    const accessToken = this.getTokenFromHeaders(headers);

    const user = await this.authService.getCurrentUser(accessToken);

    if (!user) {
      throw new HttpError({
        status: HTTP_CODES.NOT_FOUND,
        message: ERROR_MESSAGES.NOT_FOUND,
      });
    }

    return {
      status: HTTP_CODES.OK,
      payload: user,
    };
  }

  private async refresh(
    options: ApiRequest<{
      signedCookies: Partial<Pick<AllowedCookies, 'refreshToken'>>;
    }>,
  ): Promise<ApiResponse<RefreshTokenResponseDTO>> {
    const {
      signedCookies: { refreshToken: refreshTokenOld },
    } = options;

    if (!refreshTokenOld) {
      throw new HttpError({
        status: HTTP_CODES.BAD_REQUEST,
        message: ERROR_MESSAGES.MISSING_TOKEN,
      });
    }

    const { refreshToken, accessToken } =
      await this.authService.updateTokens(refreshTokenOld);

    const cookies: ApiResponse['cookies'] = [
      [
        'refreshToken',
        refreshToken,
        {
          ...this.defaultCookieOptions(),
          maxAge:
            this.config.JWT.REFRESH_EXPIRATION_DAYS * TIME_CONVERT.DAY_TO_MS,
        },
      ],
    ];
    return {
      status: HTTP_CODES.OK,
      payload: { accessToken },
      cookies,
    };
  }

  private async signIn(
    options: ApiRequest<{
      body: SignInRequestDTO;
      headers: { [HTTP_HEADERS.AUTHORIZATION]?: string };
      signedCookies: Partial<Pick<AllowedCookies, 'refreshToken'>>;
    }>,
  ): Promise<ApiResponse<SignInResponseDTO>> {
    const {
      body,
      headers,
      signedCookies: { refreshToken: refreshTokenFromCookies },
    } = options;

    this.ensureNotLoggedIn(headers);

    this.validateBody(signInSchema, body);

    let userWithTokens: UserWithTokens;
    try {
      userWithTokens = await this.authService.signIn(body);
    } catch (error) {
      throw error instanceof Error &&
        (error.message === ERROR_MESSAGES.USER_NOT_FOUND ||
          error.message === ERROR_MESSAGES.PASSWORD_INCORRECT)
        ? new HttpError({
            status: HTTP_CODES.UNAUTHORIZED,
            message: ERROR_MESSAGES.WRONG_CREDENTIALS,
          })
        : error;
    }

    if (refreshTokenFromCookies) {
      await this.authService.deleteRefreshToken(refreshTokenFromCookies);
    }

    const { refreshToken, accessToken } = userWithTokens;

    const cookies: ApiResponse['cookies'] = [
      [
        'refreshToken',
        refreshToken,
        {
          ...this.defaultCookieOptions(),
          maxAge:
            this.config.JWT.REFRESH_EXPIRATION_DAYS * TIME_CONVERT.DAY_TO_MS,
        },
      ],
    ];

    return {
      status: HTTP_CODES.OK,
      payload: { accessToken },
      cookies,
    };
  }

  private async signOut(
    options: ApiRequest<{
      signedCookies: Partial<Pick<AllowedCookies, 'refreshToken'>>;
    }>,
  ): Promise<ApiResponse> {
    const { refreshToken } = options.signedCookies;

    if (refreshToken) {
      await this.authService.deleteRefreshToken(refreshToken);
    }

    return {
      status: HTTP_CODES.NO_CONTENT,
      payload: null,
      clearCookies: [['refreshToken', { ...this.defaultCookieOptions() }]],
    };
  }

  private async signUp(
    options: ApiRequest<{
      body: SignUpRequestDTO;
      headers: { [HTTP_HEADERS.AUTHORIZATION]?: string };
      signedCookies: Partial<Pick<AllowedCookies, 'refreshToken'>>;
    }>,
  ): Promise<ApiResponse<SignUpResponseDTO>> {
    const {
      body,
      headers,
      signedCookies: { refreshToken: refreshTokenFromCookies },
    } = options;

    this.ensureNotLoggedIn(headers);

    this.validateBody(signUpSchema, body);

    let userWithTokens: UserWithTokens;
    try {
      userWithTokens = await this.authService.signUp(body);
    } catch (error) {
      throw error instanceof Error &&
        (error.message === ERROR_MESSAGES.USER_ALREADY_EXIST ||
          error.message === ERROR_MESSAGES.DUPLICATE_KEY)
        ? new HttpError({
            status: HTTP_CODES.BAD_REQUEST,
            message: ERROR_MESSAGES.USER_ALREADY_EXIST,
          })
        : error;
    }

    if (refreshTokenFromCookies) {
      await this.authService.deleteRefreshToken(refreshTokenFromCookies);
    }

    const { refreshToken, accessToken } = userWithTokens;

    const cookies: ApiResponse['cookies'] = [
      [
        'refreshToken',
        refreshToken,
        {
          ...this.defaultCookieOptions(),
          maxAge:
            this.config.JWT.REFRESH_EXPIRATION_DAYS * TIME_CONVERT.DAY_TO_MS,
        },
      ],
    ];

    return {
      status: HTTP_CODES.CREATED,
      payload: { accessToken },
      cookies,
    };
  }

  private ensureNotLoggedIn(headers: {
    [HTTP_HEADERS.AUTHORIZATION]?: string;
  }): void {
    let accessToken: string;
    try {
      accessToken = this.getTokenFromHeaders(headers);
    } catch {
      return;
    }

    const isAuthenticated = this.authService.isAuthenticated(accessToken);
    if (isAuthenticated) {
      throw new HttpError({
        status: HTTP_CODES.FORBIDDEN,
        message: ERROR_MESSAGES.USER_ALREADY_AUTHENTICATED,
      });
    }
  }
}

export { AuthController };
