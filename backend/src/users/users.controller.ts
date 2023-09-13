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

class UserController extends ControllerBase {
  // private userService: UserService;

  public constructor(logger: Logger /*userService: UserService*/) {
    super(logger, API_PATHS.USERS);
    // this.userService = userService;
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
    return {
      status: HTTP_CODES.OK,
      // payload: await this.userService.findAll(),
      payload: await Promise.resolve([
        { id: 'af' },
      ] satisfies FindAllResponseDTO),
    };
  }

  private async findById(
    options: ApiRequest<FindByIdRequestDTO>,
  ): Promise<ApiResponse<FindByIdResponseDTO>> {
    const { id } = options.params;

    return {
      status: HTTP_CODES.OK,
      payload: await Promise.resolve({ id } satisfies FindByIdResponseDTO),
    };
  }
}

export { UserController };
