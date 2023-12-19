import Joi from 'joi';

const includeConfidenceInterval = Joi.boolean()
  .required()
  .label('Confidence Interval');

export { includeConfidenceInterval };
