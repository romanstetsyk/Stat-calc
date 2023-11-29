import Joi from 'joi';

const xbar = Joi.number().required().label('Sample mean');

export { xbar };
