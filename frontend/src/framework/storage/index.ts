import { StorageBase } from './storage-base.package';

const storage = new StorageBase(() => window.localStorage);

export { storage };
export type { Storage } from './types';
