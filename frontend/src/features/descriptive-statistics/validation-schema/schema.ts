/* eslint-disable unicorn/no-thenable */
import Joi from 'joi';

import { columns, withLabel } from '~/features/validation-schemas/components';

import type { TForm } from '../types';
import { SampleStatisticsArray } from './sample-statistics';

const schema = Joi.object<TForm, true>({
  columns,
  options: SampleStatisticsArray,
  withLabel,
});

export { schema };
