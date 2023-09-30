import type { ValueOf } from '@shared/build/esm/index.js';

import type { Storage, STORAGE_KEY } from './types';

class StorageBase implements Storage {
  private storage: globalThis.Storage;

  public constructor(getStorage: () => globalThis.Storage) {
    this.storage = getStorage();
  }

  public set(key: ValueOf<typeof STORAGE_KEY>, value: string): void {
    this.storage.setItem(key, value);
  }

  public get(key: ValueOf<typeof STORAGE_KEY>): string | null {
    return this.storage.getItem(key);
  }

  public drop(key: ValueOf<typeof STORAGE_KEY>): void {
    this.storage.removeItem(key as string);
  }

  public has(key: ValueOf<typeof STORAGE_KEY>): boolean {
    const value = this.get(key);
    return Boolean(value);
  }
}

export { StorageBase };
