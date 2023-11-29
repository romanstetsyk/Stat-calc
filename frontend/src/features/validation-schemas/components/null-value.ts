import Joi from 'joi';

const nullValue = Joi.number().required().label('Mean');

export { nullValue };
