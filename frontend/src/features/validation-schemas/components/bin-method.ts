import Joi from 'joi';

import { BinMethod } from '~/types';

const binMethod = Joi.string()
  .valid(BinMethod.MANUAL, BinMethod.SQUARE_ROOT)
  .required()
  .label('Bin method');

export { binMethod };
