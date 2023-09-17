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
import type { SignUpRequestDTO, SignUpResponseDTO } from './types.js';
import { signUpSchema } from './validation-schemas.js';

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
  }

  private async signUp(
    options: ApiRequest<{ body: SignUpRequestDTO }>,
  ): Promise<ApiResponse<SignUpResponseDTO>> {
    const { body } = options;

    const { error } = signUpSchema.validate(body);
    if (error) {
      throw new HttpError({
        status: HTTP_CODES.BAD_REQUEST,
        message: error.message,
      });
    }

    let userWithToken: SignUpResponseDTO;
    try {
      userWithToken = await this.authService.signUp(body);
    } catch (error) {
      throw error instanceof Error &&
        (error.message === ERROR_MESSAGES.USER_ALREADY_EXIST ||
          error.message === ERROR_MESSAGES.DUPLICATE_KEY)
        ? new HttpError({
            status: HTTP_CODES.BAD_REQUEST,
            message: error.message,
          })
        : error;
    }

    return {
      status: HTTP_CODES.CREATED,
      payload: userWithToken,
    };
  }
}

export { AuthController };
