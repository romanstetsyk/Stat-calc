import Joi from 'joi';
import type { SignUpRequestDTO } from 'shared/build/index.js';

import { email } from './components/email.js';
import { name } from './components/name.js';
import { password } from './components/password.js';

const signUpSchema = Joi.object<SignUpRequestDTO, true>({
  name,
  email,
  password,
});

export { signUpSchema };
