// Won't work as computed property if imported

import type { UPLOAD_FIELD_NAME } from './constants/constants.js';

/**
 * Possible bug. Importing constant and using it as a computed prop
 * results in the property not included in the type on the backend
 */
type DatasetUploadRequestDTO = {
  [UPLOAD_FIELD_NAME]: File[];
};

type DatasetUploadResponseDTO = string;

export type { DatasetUploadRequestDTO, DatasetUploadResponseDTO };
