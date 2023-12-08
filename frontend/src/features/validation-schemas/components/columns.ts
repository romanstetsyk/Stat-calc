import Joi from 'joi';

import type { ColumnHeading } from '~/types';

import { columnHeading } from './column-heading';

const MIN_LENGTH = 1;

const columns = Joi.array<ColumnHeading[]>()
  .items(columnHeading.optional()) // Use optional to change error type "array.includesRequiredKnowns" to "array.min"
  .min(MIN_LENGTH)
  .unique()
  .required()
  .label('Columns')
  .messages({ 'array.min': 'Please select at least one column' });

export { columns };
