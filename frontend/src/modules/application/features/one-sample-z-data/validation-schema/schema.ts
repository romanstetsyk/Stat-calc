/* eslint-disable unicorn/no-thenable */
import Joi from 'joi';

import { Perform } from '~/modules/application/enums';
import {
  alpha,
  alternative,
  columns,
  confidenceLevel,
  includeConfidenceInterval,
  knownStdev,
  nullValue,
  perform,
  withLabel,
} from '~/modules/application/validation-schemas/components';

import type { TForm } from '../types';

const sampleData = Joi.object<TForm['sampleData'], true>({
  columns,
  withLabel,
  knownStdev,
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
  sampleData,
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
