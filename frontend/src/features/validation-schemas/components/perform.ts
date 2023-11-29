import Joi from 'joi';

import { Perform } from '~/types';

const perform = Joi.string()
  .valid(Perform.HypothesisTest, Perform.ConfidenceInerval)
  .required()
  .label('Test type');

export { perform };
