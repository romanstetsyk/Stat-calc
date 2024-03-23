import type { DatasetUploadRequestDTO } from '@shared/build/esm/index';
import {
  DATASET_VALIDATION_CONSTANTS,
  DATASET_VALIDATION_MESSAGES,
  UPLOAD_FIELD_NAME,
} from '@shared/build/esm/index';
import Joi from 'joi';

import { fileSchema } from './file-schema';
import { fileUniquenessComparator } from './file-uniqueness-comparator';

const datasetSchema = Joi.object<DatasetUploadRequestDTO>({
  [UPLOAD_FIELD_NAME]: Joi.array<File[]>()
    .items(fileSchema)
    .unique(fileUniquenessComparator)
    .required()
    .min(DATASET_VALIDATION_CONSTANTS.MIN_FILES)
    .max(DATASET_VALIDATION_CONSTANTS.MAX_FILES),
}).messages({
  'array.min': DATASET_VALIDATION_MESSAGES.MIN_FILES,
  'array.max': DATASET_VALIDATION_MESSAGES.MAX_FILES,
  'array.unique': DATASET_VALIDATION_MESSAGES.UNIQUE,
});

export { datasetSchema };
