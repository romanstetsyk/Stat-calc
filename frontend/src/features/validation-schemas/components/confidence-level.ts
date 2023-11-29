import Joi from 'joi';

import { PROBABILITY } from '../constants';

const confidenceLevel = Joi.number()
  .greater(PROBABILITY.MIN)
  .less(PROBABILITY.MAX)
  .required()
  .label('Confidence level');

export { confidenceLevel };
