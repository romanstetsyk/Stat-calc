import type { DatasetUploadRequestDTO } from '@shared/build/esm/index';
import { UPLOAD_FIELD_NAME } from '@shared/build/esm/index';

const DEFAULT_FILE_UPLOAD_PAYLOAD: DatasetUploadRequestDTO = {
  [UPLOAD_FIELD_NAME]: [],
} as const;

export { DEFAULT_FILE_UPLOAD_PAYLOAD };
