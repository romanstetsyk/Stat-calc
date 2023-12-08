/* eslint-disable unicorn/no-thenable */
import Joi from 'joi';

import {
  alpha,
  alternative,
  columnHeading,
  confidenceLevel,
  includeConfidenceInterval,
  includeSampleStatistics,
  knownStdev,
  nullValue,
  perform,
  withLabel,
} from '~/features/validation-schemas/components';
import { Perform } from '~/types';

import type { TForm } from '../types';

const sample1Data = Joi.object<TForm['sample1Data'], true>({
  sample1: columnHeading,
  knownStdev1: knownStdev,
}).required();

const sample2Data = Joi.object<TForm['sample2Data'], true>({
  sample2: columnHeading,
  knownStdev2: knownStdev,
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

const optional = Joi.object<TForm['optional'], true>({
  includeSampleStatistics,
});

const schema = Joi.object<TForm>({
  withLabel,
  sample1Data,
  sample2Data,
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
