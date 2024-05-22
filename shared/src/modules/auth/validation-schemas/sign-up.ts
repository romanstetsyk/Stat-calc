import Joi from 'joi';

import type { SignUpRequestDTO } from '../types.js';
import { email } from './components/email.js';
import { name } from './components/name.js';
import { password } from './components/password.js';
import { repeatPassword } from './components/repeat-password.js';

const signUpSchema = Joi.object<SignUpRequestDTO, true>({
  firstName: name,
  lastName: name.allow(''), // Make field optional
  email,
  password,
  repeatPassword: repeatPassword<SignUpRequestDTO>('password'),
});

export { signUpSchema };
