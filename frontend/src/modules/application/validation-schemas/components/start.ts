import Joi from 'joi';

const start = Joi.number().optional().empty('').label('Start');

export { start };
