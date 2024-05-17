import Joi from 'joi';

import type { DatasetRenameRequestDTO } from '../types.js';
import { filenameSchema } from './filename-schema.js';

const renameSchema = Joi.object<DatasetRenameRequestDTO>({
  filename: filenameSchema,
});

export { renameSchema };
