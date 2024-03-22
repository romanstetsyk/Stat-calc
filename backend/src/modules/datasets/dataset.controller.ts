import type {
  DatasetUploadRequestDTO,
  DatasetUploadResponseDTO,
  HTTP_HEADERS,
} from 'shared/build/index.js';
import {
  API_PATHS,
  API_PATHS_DATASETS,
  HTTP_CODES,
  HTTP_METHODS,
  UPLOAD_FIELD_NAME,
} from 'shared/build/index.js';

import { fileUpload } from '~/middleware/middleware.js';
import type { AuthService } from '~/modules/auth/auth.js';
import type { Config } from '~/packages/config/config.js';
import type {
  ApiRequest,
  ApiResponse,
} from '~/packages/controller/controller.js';
import { ControllerBase } from '~/packages/controller/controller.js';
import type { Logger } from '~/packages/logger/logger.js';

import type { DatasetEntity } from './dataset.entity.js';
import type { DatasetService } from './dataset.service.js';
import { fileSchema } from './validation-schemas/validation-schemas.js';

class DatasetController extends ControllerBase {
  private datasetService: DatasetService;
  private authService: AuthService;

  public constructor(
    logger: Logger,
    config: Config,
    datasetService: DatasetService,
    authService: AuthService,
  ) {
    super(logger, API_PATHS.DATASETS, config);
    this.datasetService = datasetService;
    this.authService = authService;

    this.addRoute({
      path: API_PATHS_DATASETS.UPLOAD,
      method: HTTP_METHODS.POST,
      handler: this.uploadOne.bind(this),
      plugins: [fileUpload.single(UPLOAD_FIELD_NAME)],
    });

    this.addRoute({
      path: '/all',
      method: HTTP_METHODS.GET,
      handler: this.findAllDatasets.bind(this),
    });
  }

  private async findAllDatasets(): Promise<ApiResponse<string[]>> {
    const allDatasets: DatasetEntity[] = await this.datasetService.findAll();
    return {
      status: HTTP_CODES.OK,
      payload: allDatasets.map((d) => d.originalname),
    };
  }

  private async uploadOne(
    options: ApiRequest<{
      file: Express.Multer.File;
      body: Omit<DatasetUploadRequestDTO, typeof UPLOAD_FIELD_NAME>;
      headers: { [HTTP_HEADERS.AUTHORIZATION]?: string };
    }>,
  ): Promise<ApiResponse<DatasetUploadResponseDTO>> {
    const { file, headers } = options;
    this.validateBody(fileSchema, file);

    const accessToken = this.getTokenFromHeaders(headers);
    const userId = this.authService.ensureAuth(accessToken);
    const originalname = await this.datasetService.uploadOne({
      userId,
      ...file,
    });
    return {
      status: HTTP_CODES.CREATED,
      payload: originalname,
    };
  }
}

export { DatasetController };
