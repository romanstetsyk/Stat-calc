import Joi from 'joi';

const stdev = Joi.number()
  .positive()
  .required()
  .label('Sample standard deviation');

export { stdev };
