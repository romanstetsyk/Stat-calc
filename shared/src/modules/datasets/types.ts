// Won't work as computed property if imported

import type { UPLOAD_FIELD_NAME } from './constants/constants.js';

/**
 * Possible bug. Importing constant and using it as a computed prop
 * results in the property not included in the type on the backend
 */
type DatasetUploadRequestDTO = {
  [UPLOAD_FIELD_NAME]: File[];
};

type DatasetDTO = {
  id: string;
  filename: string;
  ext: string;
  size: number;
  updatedAt: string;
};

type DatasetUploadResponseDTO = DatasetDTO;

type DatasetFindAllResponseDTO = DatasetDTO[];

type DatasetDownloadOneURLParams = { id: DatasetDTO['id'] };

type DatasetDeleteURLParams = { id: DatasetDTO['id'] };

type DatasetDeleteResponseDTO = DatasetDTO | null;

type DatasetFindOneURLParams = { id: DatasetDTO['id'] };

type DatasetFindOneRepsonseDTO = { filename: string; buffer: ArrayBuffer };

type DatasetRenameURLParams = { id: DatasetDTO['id'] };

type DatasetRenameRequestDTO = { filename: string };

type DatasetRenameResponseDTO = DatasetDTO;

type DatasetUpdateOneURLParams = { id: DatasetDTO['id'] };

type DatasetUpdateOneRequestDTO = File;

type DatasetUpdateOneResponseDTO = DatasetDTO;

export type {
  DatasetDeleteResponseDTO,
  DatasetDeleteURLParams,
  DatasetDownloadOneURLParams,
  DatasetDTO,
  DatasetFindAllResponseDTO,
  DatasetFindOneRepsonseDTO,
  DatasetFindOneURLParams,
  DatasetRenameRequestDTO,
  DatasetRenameResponseDTO,
  DatasetRenameURLParams,
  DatasetUpdateOneRequestDTO,
  DatasetUpdateOneResponseDTO,
  DatasetUpdateOneURLParams,
  DatasetUploadRequestDTO,
  DatasetUploadResponseDTO,
};
