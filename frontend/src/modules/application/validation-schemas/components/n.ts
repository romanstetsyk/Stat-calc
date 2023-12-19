import Joi from 'joi';

import { MIN_SAMPLE_SIZE } from '../constants';

const n = Joi.number()
  .integer()
  .greater(MIN_SAMPLE_SIZE)
  .required()
  .label('Sample size');

export { n };
