import {
  API_PATHS,
  API_PATHS_USERS,
  HTTP_CODES,
  HTTP_METHODS,
} from '~/constants/constants.js';
import { ControllerBase } from '~/controller/controller-base.js';
import type { Logger } from '~/logger/logger.js';
import type {
  ApiRequest,
  ApiResponse,
  FindAllResponseDTO,
  FindByIdRequestDTO,
  FindByIdResponseDTO,
} from '~/types/types.js';

import type { CreateRequestDTO, CreateResponseDTO } from './types.js';
import type { UserService } from './user.service.js';

class UserController extends ControllerBase {
  private userService: UserService;

  public constructor(logger: Logger, userService: UserService) {
    super(logger, API_PATHS.USERS);
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

    this.addRoute({
      path: API_PATHS_USERS.ROOT,
      method: HTTP_METHODS.POST,
      handler: this.create.bind(this),
    });
  }

  private async findAll(): Promise<ApiResponse<FindAllResponseDTO>> {
    const users = await this.userService.findAll();

    return {
      status: HTTP_CODES.OK,
      payload: users,
    };
  }

  private async findById(
    options: ApiRequest<{ params: FindByIdRequestDTO }>,
  ): Promise<ApiResponse<FindByIdResponseDTO>> {
    const { id } = options.params;
    const user = await this.userService.findById(id);
    return {
      status: HTTP_CODES.OK,
      payload: user,
    };
  }

  private async create(
    options: ApiRequest<{ body: CreateRequestDTO }>,
  ): Promise<ApiResponse<CreateResponseDTO>> {
    const { name, email, passwordHash } = options.body;
    const user = await this.userService.create({ name, email, passwordHash });
    return {
      status: HTTP_CODES.CREATED,
      payload: user,
    };
  }
}

export { UserController };
