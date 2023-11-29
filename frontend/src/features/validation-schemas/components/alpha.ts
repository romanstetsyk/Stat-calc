import Joi from 'joi';

import { PROBABILITY } from '../constants';

const alpha = Joi.number()
  .greater(PROBABILITY.MIN)
  .less(PROBABILITY.MAX)
  .required()
  .label('Level of significance');

export { alpha };
