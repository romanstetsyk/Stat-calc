import Joi from 'joi';

import { FrequencyDistribution } from '../types';

const FrequencyDistributionOption = Joi.string<FrequencyDistribution>()
  .valid(...FrequencyDistribution)
  .required()
  .label('Options')
  .messages({ 'array.min': 'Please select at least one option' });

export { FrequencyDistributionOption };
