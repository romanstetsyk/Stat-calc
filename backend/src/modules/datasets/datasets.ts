import { API_PATHS } from 'shared/build/index.js';

import { authService } from '~/modules/auth/auth.js';
import { logger } from '~/packages/logger/logger.js';

import { DatasetController } from './dataset.controller.js';
import { DatasetModel } from './dataset.model.js';
import { DatasetRepository } from './dataset.repository.js';
import { DatasetService } from './dataset.service.js';

const datasetRepository = new DatasetRepository(DatasetModel);
const datasetService = new DatasetService({ datasetRepository });
const datasetsController = new DatasetController({
  segment: API_PATHS.DATASETS,
  datasetService,
  authService,
  logger,
});

export { datasetsController };
