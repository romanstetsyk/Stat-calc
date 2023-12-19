import Joi from 'joi';

import { SampleStatistics } from '../types';

const MIN_LENGTH = 1;

const SampleStatisticsArray = Joi.array<SampleStatistics[]>()
  .items(...SampleStatistics.map((element) => Joi.string().valid(element)))
  .min(MIN_LENGTH)
  .unique()
  .required()
  .label('Sample Statistics')
  .messages({ 'array.min': 'Please select at least one statistic' });

export { SampleStatisticsArray };
