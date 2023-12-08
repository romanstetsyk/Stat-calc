import Joi from 'joi';

const includeSampleStatistics = Joi.boolean()
  .required()
  .label('Sample Statistics');

export { includeSampleStatistics };
