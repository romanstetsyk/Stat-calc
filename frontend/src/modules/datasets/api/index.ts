import { API_PATHS } from '@shared/build/esm/index';

import { config } from '~/config';
import { http } from '~/framework/http';
import { storage } from '~/framework/storage';

import { DatasetApi } from './dataset-api';

const baseUrl = config.API_BASE_URL;
const prefix = [config.API_PREFIX, config.API_VERSION, API_PATHS.DATASETS];

const datasetApi = new DatasetApi({ baseUrl, prefix, http, storage });

export { datasetApi };
