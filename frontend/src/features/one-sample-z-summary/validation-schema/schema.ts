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
