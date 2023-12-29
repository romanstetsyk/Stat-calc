import type { GridColumnName } from '../types';

const createColumnName = (index: number): GridColumnName => `col${index + 1}`;

export { createColumnName };
