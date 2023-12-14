import { nanoid } from 'nanoid';
import { useSyncExternalStore } from 'react';

import { Dataset } from './grid-data.package';
import type { GridData } from './types';

const datasetId = nanoid();
const dataset = new Dataset(datasetId);

const useGridData = (): GridData => {
  return useSyncExternalStore(
    dataset.subscribe.bind(dataset),
    dataset.getSnapshot.bind(dataset),
  );
};

export { useGridData };
