import Joi from 'joi';

import type { SignUpRequestDTO } from '../types.js';
import { email } from './components/email.js';
import { name } from './components/name.js';
import { password } from './components/password.js';

const signUpSchema = Joi.object<SignUpRequestDTO, true>({
  name,
  email,
  password,
});

export { signUpSchema };
