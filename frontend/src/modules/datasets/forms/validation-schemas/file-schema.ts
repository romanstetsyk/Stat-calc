import {
  DATASET_VALIDATION_CONSTANTS,
  DATASET_VALIDATION_MESSAGES,
} from '@shared/build/esm/index';
import Joi from 'joi';

import {
  FileErrorCodes,
  fileNameValidator,
  filesizeValidator,
  mimetypeValidator,
} from './custom-file-validators';

const fileSchema = Joi.object<File>()
  .instance(File)
  .custom(
    fileNameValidator(
      DATASET_VALIDATION_CONSTANTS.FILENAME_LENGTH_MIN,
      DATASET_VALIDATION_CONSTANTS.FILENAME_LENGTH_MAX,
    ),
  )
  .custom(mimetypeValidator(DATASET_VALIDATION_CONSTANTS.ALLOWED_MIMETYPES))
  .custom(
    filesizeValidator(
      DATASET_VALIDATION_CONSTANTS.FILESIZE_MIN,
      DATASET_VALIDATION_CONSTANTS.FILESIZE_MAX,
    ),
  )
  .label('File')
  .messages({
    [FileErrorCodes.FILENAME_MIN]:
      DATASET_VALIDATION_MESSAGES.FILENAME_LENGTH_MIN,
    [FileErrorCodes.FILENAME_MAX]:
      DATASET_VALIDATION_MESSAGES.FILENAME_LENGTH_MAX,
    [FileErrorCodes.MIMETYPE_ONLY]:
      DATASET_VALIDATION_MESSAGES.ALLOWED_MIMETYPES,
    [FileErrorCodes.FILESIZE_MAX]: DATASET_VALIDATION_MESSAGES.FILESIZE_MAX,
    [FileErrorCodes.FILESIZE_GREATER]: DATASET_VALIDATION_MESSAGES.FILESIZE_MIN,
  });

export { fileSchema };
