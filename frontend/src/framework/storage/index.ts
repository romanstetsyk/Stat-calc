import type { ValueOf } from '@shared/build/esm/index';

import type { STORAGE_KEYS } from '~/common/constants';

import { StorageBase } from './storage-base.package';

const storage = new StorageBase<ValueOf<typeof STORAGE_KEYS>>(
  () => window.localStorage,
);

type Storage = typeof storage;

export { storage };
export type { Storage };
