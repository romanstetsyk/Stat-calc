/* eslint-disable unicorn/no-thenable */
import Joi from 'joi';

import {
  columns,
  withLabel,
} from '~/modules/application/validation-schemas/components';

import type { TForm } from '../types';
import { FrequencyDistributionArray } from './frequency-distribution';

const schema = Joi.object<TForm, true>({
  columns,
  options: FrequencyDistributionArray,
  withLabel,
});

export { schema };
