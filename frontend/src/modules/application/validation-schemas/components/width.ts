import Joi from 'joi';

const width = Joi.number().positive().required().label('Width');

export { width };
