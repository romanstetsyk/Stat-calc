import Joi from 'joi';

import { H1Sign } from '~/types';

const alternative = Joi.string()
  .valid(...Object.keys(H1Sign))
  .required()
  .label('The alternative hypothesis');

export { alternative };
