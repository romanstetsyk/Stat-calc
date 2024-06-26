import {
  ERROR_MESSAGES,
  HTTP_CODES,
  HTTP_METHODS,
  HttpError,
} from 'shared/build/index.js';
import { validate as validateUUID } from 'uuid';

import { API_PATHS_USERS } from '~/common/constants/constants.js';
import type {
  ApiRequest,
  ApiResponse,
  ControllerBaseConstructor,
} from '~/packages/controller/controller.js';
import { ControllerBase } from '~/packages/controller/controller.js';

import type {
  FindAllResponseDTO,
  FindByIdRequestDTO,
  FindByIdResponseDTO,
} from './types.js';
import type { UserService } from './user.service.js';

type UserControllerConstructor = ControllerBaseConstructor & {
  userService: UserService;
};

class UserController extends ControllerBase {
  private userService: UserService;

  public constructor({
    segment,
    logger,
    userService,
  }: UserControllerConstructor) {
    super({ segment, logger });
    this.userService = userService;

    this.addRoute({
      path: API_PATHS_USERS.ROOT,
      method: HTTP_METHODS.GET,
      handler: this.findAll.bind(this),
    });

    this.addRoute({
      path: API_PATHS_USERS.$ID,
      method: HTTP_METHODS.GET,
      handler: this.findById.bind(this),
    });
  }

  private async findAll(): Promise<ApiResponse<FindAllResponseDTO>> {
    const users = await this.userService.findAll();

    return {
      status: HTTP_CODES.OK,
      payload: users.map((e) => e.toObject()),
    };
  }

  private async findById(
    options: ApiRequest<{ params: FindByIdRequestDTO }>,
  ): Promise<ApiResponse<FindByIdResponseDTO>> {
    const { id } = options.params;

    if (!validateUUID(id)) {
      throw new HttpError({
        status: HTTP_CODES.NOT_FOUND,
        message: ERROR_MESSAGES.NOT_FOUND,
      });
    }

    const user = await this.userService.findById(id);

    if (!user) {
      throw new HttpError({
        status: HTTP_CODES.NOT_FOUND,
        message: ERROR_MESSAGES.NOT_FOUND,
      });
    }

    return {
      status: HTTP_CODES.OK,
      payload: user.toObject(),
    };
  }
}

export { UserController };
