import Joi from 'joi';

import type { ColumnHeading } from '~/types';

import { COLUMN_NAME_PATTERN } from '../constants';

const columnHeading = Joi.string<ColumnHeading>()
  .pattern(COLUMN_NAME_PATTERN)
  .required()
  .label('Column')
  .messages({ 'string.pattern.base': 'Invalid column heading' });

export { columnHeading };
