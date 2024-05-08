import { DATASET_VALIDATION_CONSTANTS } from '@shared/build/esm/index';
import { utils, write } from 'xlsx';

import type { ArrayLike } from '~/framework/array-like';

const createDatasetFile = (
  data: ArrayLike<ArrayLike<unknown>>,
  filename: string,
): File | null => {
  if (data.length === 0) {
    return null;
  }
  const aoa: unknown[][] = [];
  for (const i in data) {
    aoa[i] = [];
    for (const j in data[i]) {
      const r = data[i];
      aoa[i][j] = r[j];
    }
  }
  const worksheet = utils.aoa_to_sheet(aoa);
  const workbook = utils.book_new(worksheet);

  const buffer: Uint8Array = write(workbook, {
    type: 'array',
    bookType: 'csv',
  });
  return new File([buffer], filename, {
    type: DATASET_VALIDATION_CONSTANTS.ALLOWED_MIMETYPES[0],
  });
};

export { createDatasetFile };
