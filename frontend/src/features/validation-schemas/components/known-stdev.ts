import Joi from 'joi';

const knownStdev = Joi.number().positive().label('Sample standard deviation');

export { knownStdev };
