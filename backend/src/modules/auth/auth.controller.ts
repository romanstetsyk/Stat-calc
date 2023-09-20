import {
  API_PATHS,
  API_PATHS_AUTH,
  ERROR_MESSAGES,
  HTTP_CODES,
  HTTP_METHODS,
} from '~/common/constants/constants.js';
import type {
  ApiRequest,
  ApiResponse,
} from '~/packages/controller/controller.js';
import { ControllerBase } from '~/packages/controller/controller.js';
import { HttpError } from '~/packages/http-error/http-error.js';
import type { Logger } from '~/packages/logger/logger.js';

import type { AuthService } from './auth.service.js';
import type {
  SignInRequestDTO,
  SignInResponseDTO,
  SignUpRequestDTO,
  SignUpResponseDTO,
  UserWithTokens,
} from './types.js';
import {
  signInSchema,
  signUpSchema,
} from './validation-schemas/validation-schemas.js';

class AuthController extends ControllerBase {
  private authService: AuthService;
  public constructor(logger: Logger, authService: AuthService) {
    super(logger, API_PATHS.AUTH);
    this.authService = authService;

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
  }

  private async signIn(
    options: ApiRequest<{
      body: SignInRequestDTO;
      headers: { authorization?: string };
      cookies: { refreshToken?: string };
    }>,
  ): Promise<ApiResponse<SignInResponseDTO>> {
    const {
      body,
      headers,
      cookies: { refreshToken: refreshTokenFromCookies },
    } = options;

    this.ensureNotLoggedIn(headers);

    this.validateBody(signInSchema, body);

    let userWithToken: UserWithTokens;
    try {
      userWithToken = await this.authService.signIn(body);
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
      await this.authService.deleteRefreshToken(
        refreshTokenFromCookies,
        userWithToken.id,
      );
    }

    const { refreshToken, ...payload } = userWithToken;

    const cookies: ApiResponse['cookies'] = [
      [
        'refreshToken',
        refreshToken,
        { httpOnly: true, sameSite: 'strict', secure: true /* signed: true */ },
      ],
    ];

    return {
      status: HTTP_CODES.OK,
      payload,
      cookies,
    };
  }

  private async signUp(
    options: ApiRequest<{
      body: SignUpRequestDTO;
      headers: { authorization?: string };
    }>,
  ): Promise<ApiResponse<SignUpResponseDTO>> {
    const { body, headers } = options;

    this.ensureNotLoggedIn(headers);

    this.validateBody(signUpSchema, body);

    try {
      await this.authService.signUp(body);
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

    return {
      status: HTTP_CODES.CREATED,
      payload: {
        message: 'Sign-up successfull. Please sign-in',
      },
    };
  }

  private ensureNotLoggedIn(headers: { authorization?: string }): void {
    const isAuthenticated = this.authService.isAuthenticated(headers);
    if (isAuthenticated) {
      throw new HttpError({
        status: HTTP_CODES.FORBIDDEN,
        message: ERROR_MESSAGES.USER_ALREADY_AUTHENTICATED,
      });
    }
  }
}

export { AuthController };
