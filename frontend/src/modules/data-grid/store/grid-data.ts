import { nanoid } from 'nanoid';
import { useSyncExternalStore } from 'react';

import type { GridData } from '../types';
import { Dataset } from './grid-data.package';

const id = nanoid();
const dataset = new Dataset(id);

const useGridData = (): GridData => {
  return useSyncExternalStore(
    dataset.subscribe.bind(dataset),
    dataset.getSnapshot.bind(dataset),
  );
};

export { useGridData };
