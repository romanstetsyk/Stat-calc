import Joi from 'joi';

import type { SignInRequestDTO } from '../types.js';
import { email } from './components/email.js';
import { password } from './components/password.js';

const signInSchema = Joi.object<SignInRequestDTO, true>({
  email,
  password,
});

export { signInSchema };
