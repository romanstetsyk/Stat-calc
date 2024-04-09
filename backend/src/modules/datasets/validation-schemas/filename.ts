import Joi from 'joi';
import {
  DATASET_VALIDATION_CONSTANTS,
  DATASET_VALIDATION_MESSAGES,
} from 'shared/build/index.js';

const filename = Joi.string()
  .trim()
  .min(DATASET_VALIDATION_CONSTANTS.FILENAME_LENGTH_MIN)
  .max(DATASET_VALIDATION_CONSTANTS.FILENAME_LENGTH_MAX)
  .required()
  .label('Filename')
  .messages({
    'string.min': DATASET_VALIDATION_MESSAGES.FILENAME_LENGTH_MIN,
    'string.max': DATASET_VALIDATION_MESSAGES.FILENAME_LENGTH_MAX,
  });

export { filename };
