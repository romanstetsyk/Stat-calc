import { nanoid } from 'nanoid';
import { useSyncExternalStore } from 'react';

import { Dataset } from './grid-data.package';
import type { Snapshot } from './types';

const datasetId = nanoid();
const dataset = new Dataset(datasetId);

const useGridData = (): Snapshot => {
  return useSyncExternalStore(
    dataset.subscribe.bind(dataset),
    dataset.getSnapshot.bind(dataset),
  );
};

export { useGridData };
