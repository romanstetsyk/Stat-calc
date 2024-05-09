import { useSyncExternalStore } from 'react';

import { gridData } from '../store';
import type { GridData } from '../types';

const useGridData = (): GridData => {
  return useSyncExternalStore(
    gridData.subscribe.bind(gridData),
    gridData.getSnapshot.bind(gridData),
  );
};

export { useGridData };
