import type { GridColumnName } from '~/types';

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const createColName = (index: number): GridColumnName => `col${index + 1}`;

export { createColName };
