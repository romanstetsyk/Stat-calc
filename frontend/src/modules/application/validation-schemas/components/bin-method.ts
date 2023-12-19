import Joi from 'joi';

import { BinMethod } from '~/modules/application/enums';

const binMethod = Joi.string()
  .valid(BinMethod.MANUAL, BinMethod.SQUARE_ROOT)
  .required()
  .label('Bin method');

export { binMethod };
