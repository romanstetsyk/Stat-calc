import Joi from 'joi';

import { H1Sign } from '~/modules/application/enums';

const alternative = Joi.string()
  .valid(...Object.keys(H1Sign))
  .required()
  .label('The alternative hypothesis');

export { alternative };
