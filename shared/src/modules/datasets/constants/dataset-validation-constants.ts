import { FILESIZES } from '~/constants/constants.js';

const DATASET_VALIDATION_CONSTANTS = {
  FILESIZE_MIN: FILESIZES.EMPTY,
  FILESIZE_MAX: FILESIZES['1MiB'],
  FILENAME_LENGTH_MIN: 1,
  FILENAME_LENGTH_MAX: 255,
  ALLOWED_MIMETYPES: ['text/csv'],
  MIN_FILES: 1,
  MAX_FILES: 1,
} as const;

const DATASET_VALIDATION_MESSAGES = {
  FILESIZE_MIN: `Filesize must be greater than ${DATASET_VALIDATION_CONSTANTS.FILESIZE_MIN / FILESIZES['1KiB']} KiB`,
  FILESIZE_MAX: `Filesize must be less than or equal to ${DATASET_VALIDATION_CONSTANTS.FILESIZE_MAX / FILESIZES['1KiB']} KiB`,
  FILENAME_LENGTH_MIN: `Filename length must be at least ${DATASET_VALIDATION_CONSTANTS.FILENAME_LENGTH_MIN} characters long`,
  FILENAME_LENGTH_MAX: `Filename length must be less than or equal to ${DATASET_VALIDATION_CONSTANTS.FILENAME_LENGTH_MAX} characters long`,
  ALLOWED_MIMETYPES: `File type must be one of [ ${DATASET_VALIDATION_CONSTANTS.ALLOWED_MIMETYPES.join(', ')} ]`,
  MIN_FILES: `Please select at least ${DATASET_VALIDATION_CONSTANTS.MIN_FILES} file`,
  MAX_FILES: `Please upload at most ${DATASET_VALIDATION_CONSTANTS.MAX_FILES} file at a time`,
  UNIQUE: 'This file has already been selected',
} as const;

export { DATASET_VALIDATION_CONSTANTS, DATASET_VALIDATION_MESSAGES };
