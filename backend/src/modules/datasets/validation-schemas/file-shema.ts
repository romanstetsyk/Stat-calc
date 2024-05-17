import Joi from 'joi';
import {
  DATASET_VALIDATION_CONSTANTS,
  DATASET_VALIDATION_MESSAGES,
  filenameSchema,
} from 'shared/build/index.js';

/**
 * Can't validate File objects
 * https://react-hook-form.com/docs/useform#defaultValues
 * "It's recommended to avoid using custom objects containing prototype methods"
 * Multer passes a clone of a file with additional properties
 * and a prototype of Object
 */
const fileSchema = Joi.object<Express.Multer.File>({
  originalname: filenameSchema,
  mimetype: Joi.string()
    .valid(...DATASET_VALIDATION_CONSTANTS.ALLOWED_MIMETYPES)
    .required()
    .label('Mimetype')
    .messages({
      'any.only': DATASET_VALIDATION_MESSAGES.ALLOWED_MIMETYPES,
    }),
  buffer: Joi.binary()
    // There's no 'greater' method, use 'size' property to check it
    .max(DATASET_VALIDATION_CONSTANTS.FILESIZE_MAX)
    .required()
    .label('File buffer')
    .messages({
      'binary.max': DATASET_VALIDATION_MESSAGES.FILESIZE_MAX,
    }),
  size: Joi.number()
    .greater(DATASET_VALIDATION_CONSTANTS.FILESIZE_MIN)
    .max(DATASET_VALIDATION_CONSTANTS.FILESIZE_MAX)
    .required()
    .label('Size')
    .messages({
      'number.greater': DATASET_VALIDATION_MESSAGES.FILESIZE_MIN,
      'number.max': DATASET_VALIDATION_MESSAGES.FILESIZE_MAX,
    }),
})
  .unknown(true)
  .required()
  .label('File');

export { fileSchema };
