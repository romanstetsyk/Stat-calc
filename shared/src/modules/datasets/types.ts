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
  size: number;
  updatedAt: string;
};

type DatasetUploadResponseDTO = DatasetDTO;

type DatasetFindAllResponseDTO = DatasetDTO[];

type DatasetDeleteURLParams = { id: DatasetDTO['id'] };

type DatasetDeleteResponseDTO = DatasetDTO | null;

type DatasetFindOneURLParams = { id: DatasetDTO['id'] };

type DatasetFindOneRepsonseDTO = { filename: string; buffer: ArrayBuffer };

export type {
  DatasetDeleteResponseDTO,
  DatasetDeleteURLParams,
  DatasetDTO,
  DatasetFindAllResponseDTO,
  DatasetFindOneRepsonseDTO,
  DatasetFindOneURLParams,
  DatasetUploadRequestDTO,
  DatasetUploadResponseDTO,
};
