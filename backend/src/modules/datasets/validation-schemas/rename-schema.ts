import Joi from 'joi';
import type { DatasetRenameRequestDTO } from 'shared/build/index.js';

import { filename } from './filename.js';

const renameSchema = Joi.object<DatasetRenameRequestDTO>({
  filename,
});

export { renameSchema };
