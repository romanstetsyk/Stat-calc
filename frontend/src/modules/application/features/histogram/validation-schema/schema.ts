/* eslint-disable unicorn/no-thenable */
import Joi from 'joi';

import { BinMethod } from '~/modules/application/enums';
import {
  binMethod,
  columns,
  start,
  width,
  withLabel,
} from '~/modules/application/validation-schemas/components';

import type { TForm } from '../types';
import { FrequencyDistributionOption } from './frequency-distribution';

const manual = Joi.object<TForm['manual'], true>({ start, width }).required();

const squareRoot = Joi.object<TForm['squareRoot'], true>({ start }).required();

const schema = Joi.object<TForm>({
  columns,
  options: FrequencyDistributionOption,
  withLabel,
  method: binMethod,
  manual: Joi.when('method', {
    is: BinMethod.MANUAL,
    then: manual,
  }),
  squareRoot: Joi.when('method', {
    is: BinMethod.SQUARE_ROOT,
    then: squareRoot,
  }),
});

export { schema };
