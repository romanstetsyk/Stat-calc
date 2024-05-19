import type {
  DatasetDeleteResponseDTO,
  DatasetDeleteURLParams,
  DatasetDownloadOneURLParams,
  DatasetFindAllResponseDTO,
  DatasetFindOneRepsonseDTO,
  DatasetRenameRequestDTO,
  DatasetRenameResponseDTO,
  DatasetRenameURLParams,
  DatasetUpdateOneResponseDTO,
  DatasetUpdateOneURLParams,
  DatasetUploadRequestDTO,
  DatasetUploadResponseDTO,
  HTTP_HEADERS,
} from 'shared/build/index.js';
import {
  API_PATHS_DATASETS,
  ERROR_MESSAGES,
  HTTP_CODES,
  HTTP_METHODS,
  HttpError,
  parseFilename,
  renameSchema,
  UPLOAD_FIELD_NAME,
} from 'shared/build/index.js';

import { fileUpload } from '~/middleware/middleware.js';
import type { AuthService } from '~/modules/auth/auth.js';
import type {
  ApiRequest,
  ApiResponse,
  ControllerBaseConstructor,
} from '~/packages/controller/controller.js';
import { ControllerBase } from '~/packages/controller/controller.js';

import type { DatasetService } from './dataset.service.js';
import { fileSchema } from './validation-schemas/validation-schemas.js';

type DatasetControllerConstructor = ControllerBaseConstructor & {
  datasetService: DatasetService;
  authService: AuthService;
};

class DatasetController extends ControllerBase {
  private datasetService: DatasetService;
  private authService: AuthService;

  public constructor({
    segment,
    logger,
    datasetService,
    authService,
  }: DatasetControllerConstructor) {
    super({ segment, logger });
    this.datasetService = datasetService;
    this.authService = authService;

    this.addRoute({
      path: API_PATHS_DATASETS.UPLOAD,
      method: HTTP_METHODS.POST,
      handler: this.uploadOne.bind(this),
      plugins: [fileUpload.single(UPLOAD_FIELD_NAME)],
    });

    this.addRoute({
      path: API_PATHS_DATASETS.ROOT,
      method: HTTP_METHODS.GET,
      handler: this.findAll.bind(this),
    });

    this.addRoute({
      path: API_PATHS_DATASETS.$ID,
      method: HTTP_METHODS.DELETE,
      handler: this.delete.bind(this),
    });

    this.addRoute({
      path: API_PATHS_DATASETS.$ID,
      method: HTTP_METHODS.GET,
      handler: this.downloadOne.bind(this),
    });

    this.addRoute({
      path: API_PATHS_DATASETS.$ID,
      method: HTTP_METHODS.PUT,
      handler: this.rename.bind(this),
    });

    this.addRoute({
      path: API_PATHS_DATASETS.$IDUpdate,
      method: HTTP_METHODS.PUT,
      handler: this.updateOne.bind(this),
      plugins: [fileUpload.single(UPLOAD_FIELD_NAME)],
    });
  }

  private async findAll(
    options: ApiRequest<{
      headers: { [HTTP_HEADERS.AUTHORIZATION]?: string };
    }>,
  ): Promise<ApiResponse<DatasetFindAllResponseDTO>> {
    const { headers } = options;
    const accessToken = this.getTokenFromHeaders(headers);
    const userId = this.authService.ensureAuth(accessToken);
    const datasets = await this.datasetService.findAll(userId);
    return {
      status: HTTP_CODES.OK,
      payload: datasets,
    };
  }

  private async downloadOne(
    options: ApiRequest<{
      headers: { [HTTP_HEADERS.AUTHORIZATION]?: string };
      params: DatasetDownloadOneURLParams;
    }>,
  ): Promise<ApiResponse> {
    const {
      headers,
      params: { id },
    } = options;

    const accessToken = this.getTokenFromHeaders(headers);
    const userId = this.authService.ensureAuth(accessToken);
    const dataset = await this.datasetService.downloadOne({ id, userId });
    if (!dataset) {
      throw new HttpError({
        status: HTTP_CODES.NOT_FOUND,
        message: ERROR_MESSAGES.NOT_FOUND,
      });
    }
    return {
      status: HTTP_CODES.OK,
      file: dataset satisfies DatasetFindOneRepsonseDTO,
    };
  }

  private async delete(
    options: ApiRequest<{
      headers: { [HTTP_HEADERS.AUTHORIZATION]?: string };
      params: DatasetDeleteURLParams;
    }>,
  ): Promise<ApiResponse<DatasetDeleteResponseDTO>> {
    const {
      headers,
      params: { id },
    } = options;
    const accessToken = this.getTokenFromHeaders(headers);
    const userId = this.authService.ensureAuth(accessToken);
    const deletedDataset = await this.datasetService.delete({ id, userId });
    return {
      status: HTTP_CODES.OK,
      payload: deletedDataset,
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
    const { originalname, buffer, mimetype, size } = file;
    const { name, ext } = parseFilename(originalname);

    const accessToken = this.getTokenFromHeaders(headers);
    const userId = this.authService.ensureAuth(accessToken);
    const uploadedDataset = await this.datasetService.uploadOne({
      name,
      displayName: name,
      ext,
      mimetype,
      size,
      buffer,
      userId,
    });
    return {
      status: HTTP_CODES.CREATED,
      payload: uploadedDataset,
    };
  }

  private async rename(
    options: ApiRequest<{
      params: DatasetRenameURLParams;
      body: DatasetRenameRequestDTO;
      headers: { [HTTP_HEADERS.AUTHORIZATION]?: string };
    }>,
  ): Promise<ApiResponse<DatasetRenameResponseDTO>> {
    const {
      params: { id },
      body,
      headers,
    } = options;
    this.validateBody(renameSchema, body);
    const accessToken = this.getTokenFromHeaders(headers);
    const userId = this.authService.ensureAuth(accessToken);

    const renamedDataset = await this.datasetService.rename({
      id,
      userId,
      displayName: body.filename,
    });
    if (!renamedDataset) {
      throw new HttpError({
        status: HTTP_CODES.BAD_REQUEST,
        message: ERROR_MESSAGES.BAD_REQUEST,
      });
    }
    return {
      status: HTTP_CODES.OK,
      payload: renamedDataset,
    };
  }

  private async updateOne(
    options: ApiRequest<{
      file: Express.Multer.File;
      params: DatasetUpdateOneURLParams;
      headers: { [HTTP_HEADERS.AUTHORIZATION]?: string };
    }>,
  ): Promise<ApiResponse<DatasetUpdateOneResponseDTO>> {
    const {
      params: { id },
      file,
      headers,
    } = options;
    this.validateBody(fileSchema, file);
    const { originalname, buffer, mimetype, size } = file;
    const { name, ext } = parseFilename(originalname);

    const accessToken = this.getTokenFromHeaders(headers);
    const userId = this.authService.ensureAuth(accessToken);
    const updatedDataset = await this.datasetService.update(id, {
      name,
      displayName: name,
      ext,
      mimetype,
      size,
      buffer,
      userId,
    });
    if (!updatedDataset) {
      throw new HttpError({
        status: HTTP_CODES.BAD_REQUEST,
        message: ERROR_MESSAGES.BAD_REQUEST,
      });
    }
    return {
      status: HTTP_CODES.OK,
      payload: updatedDataset,
    };
  }
}

export { DatasetController };
