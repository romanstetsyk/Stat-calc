import { useSyncExternalStore } from 'react';

import type { GridData } from '../types';
import { Dataset } from './grid-data.package';

const id = crypto.randomUUID();
const dataset = new Dataset(id);

const useGridData = (): GridData => {
  return useSyncExternalStore(
    dataset.subscribe.bind(dataset),
    dataset.getSnapshot.bind(dataset),
  );
};

export { useGridData };
