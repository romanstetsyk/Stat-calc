import Joi from 'joi';

import { FrequencyDistribution } from '../types';

const MIN_LENGTH = 1;

const FrequencyDistributionArray = Joi.array<FrequencyDistribution[]>()
  .items(...FrequencyDistribution.map((element) => Joi.string().valid(element)))
  .min(MIN_LENGTH)
  .unique()
  .required()
  .label('Options')
  .messages({ 'array.min': 'Please select at least one option' });

export { FrequencyDistributionArray };
