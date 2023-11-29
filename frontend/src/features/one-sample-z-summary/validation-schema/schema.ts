/* eslint-disable unicorn/no-thenable */
import Joi from 'joi';

import {
  alpha,
  alternative,
  confidenceLevel,
  includeConfidenceInterval,
  n,
  nullValue,
  perform,
  stdev,
  xbar,
} from '~/features/validation-schemas/components';
import { Perform } from '~/types';

import type { TForm } from '../types';

const schema = Joi.object<TForm>({
  sampleData: Joi.object({
    xbar,
    stdev,
    n,
  }).required(),
  perform,
  hypothesisTest: Joi.when('perform', {
    is: Perform.HypothesisTest,
    then: Joi.object({
      alternative,
      nullValue,
      alpha,
      optional: Joi.object({
        includeConfidenceInterval,
      }).required(),
    }),
  }),
  confidenceInterval: Joi.when('perform', {
    is: Perform.ConfidenceInerval,
    then: Joi.object({
      confidenceLevel,
    }),
  }),
});

export { schema };
