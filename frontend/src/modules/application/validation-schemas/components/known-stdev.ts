import Joi from 'joi';

const knownStdev = Joi.number()
  .positive()
  .optional()
  .empty('') // allow empty string, it'll be casted to undefined
  .label('Sample standard deviation');

export { knownStdev };
