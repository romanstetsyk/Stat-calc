import { nanoid } from 'nanoid';
import { useSyncExternalStore } from 'react';

import type { GridData } from '../types';
import { Dataset } from './grid-data.package';

const datasetId = nanoid();
const dataset = new Dataset(datasetId);

const useGridData = (): GridData => {
  return useSyncExternalStore(
    dataset.subscribe.bind(dataset),
    dataset.getSnapshot.bind(dataset),
  );
};

export { useGridData };
