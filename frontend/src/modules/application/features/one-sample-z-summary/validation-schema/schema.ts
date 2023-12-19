/* eslint-disable unicorn/no-thenable */
import Joi from 'joi';

import { Perform } from '~/modules/application/enums';
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
} from '~/modules/application/validation-schemas/components';

import type { TForm } from '../types';

const sampleSummary = Joi.object<TForm['sampleSummary'], true>({
  xbar,
  stdev,
  n,
}).required();

const hypothesisTestOptional = Joi.object<
  TForm['hypothesisTest']['optional'],
  true
>({
  includeConfidenceInterval,
});

const hypothesisTest = Joi.object<TForm['hypothesisTest'], true>({
  alternative,
  nullValue,
  alpha,
  optional: hypothesisTestOptional,
});

const confidenceInterval = Joi.object<TForm['confidenceInterval'], true>({
  confidenceLevel,
});

const schema = Joi.object<TForm>({
  sampleSummary,
  perform,
  hypothesisTest: Joi.when('perform', {
    is: Perform.HypothesisTest,
    then: hypothesisTest,
  }),
  confidenceInterval: Joi.when('perform', {
    is: Perform.ConfidenceInerval,
    then: confidenceInterval,
  }),
});

export { schema };
