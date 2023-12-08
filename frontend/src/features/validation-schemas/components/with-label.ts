import Joi from 'joi';

const withLabel = Joi.boolean().required().label('Label');

export { withLabel };
