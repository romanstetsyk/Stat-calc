/* eslint-disable unicorn/no-thenable */
import Joi from 'joi';

import {
  alpha,
  alternative,
  confidenceLevel,
  includeConfidenceInterval,
  includeSampleStatistics,
  n,
  nullValue,
  perform,
  stdev,
  xbar,
} from '~/features/validation-schemas/components';
import { Perform } from '~/types';

import type { TForm } from '../types';

const sample1Summary = Joi.object<TForm['sample1Summary'], true>({
  xbar1: xbar,
  stdev1: stdev,
  n1: n,
}).required();

const sample2Summary = Joi.object<TForm['sample2Summary'], true>({
  xbar2: xbar,
  stdev2: stdev,
  n2: n,
}).required();

const hypothesisTestOptional = Joi.object<
  TForm['hypothesisTest']['optional'],
  true
>({
  includeConfidenceInterval,
}).required();

const hypothesisTest = Joi.object<TForm['hypothesisTest'], true>({
  alternative,
  nullValue,
  alpha,
  optional: hypothesisTestOptional,
});

const confidenceInterval = Joi.object<TForm['confidenceInterval'], true>({
  confidenceLevel,
});

const optional = Joi.object<TForm['optional'], true>({
  includeSampleStatistics,
});

const schema = Joi.object<TForm>({
  sample1Summary,
  sample2Summary,
  perform,
  hypothesisTest: Joi.when('perform', {
    is: Perform.HypothesisTest,
    then: hypothesisTest,
  }),
  confidenceInterval: Joi.when('perform', {
    is: Perform.ConfidenceInerval,
    then: confidenceInterval,
  }),
  optional,
});

export { schema };
