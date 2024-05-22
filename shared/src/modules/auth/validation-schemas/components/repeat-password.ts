import Joi from 'joi';

import { USER_VALIDATION_MESSAGES } from '../../constants';

const repeatPassword = <T extends object>(
  field: Extract<keyof T, string>,
): Joi.StringSchema =>
  Joi.string()
    .valid(Joi.ref(field))
    .messages({ 'any.only': USER_VALIDATION_MESSAGES.PASSWORD_MATCH });

export { repeatPassword };
