class StorageBase<T extends string> implements Storage {
  private storage: globalThis.Storage;
  public readonly length: number;

  public constructor(getStorage: () => globalThis.Storage) {
    this.storage = getStorage();
    this.length = this.storage.length;
  }

  public setItem(key: T, value: string): void {
    this.storage.setItem(key, value);
  }

  public getItem(key: T): string | null {
    return this.storage.getItem(key);
  }

  public removeItem(key: T): void {
    this.storage.removeItem(key);
  }

  public clear(): void {
    this.storage.clear();
  }

  public key(index: number): string | null {
    return this.storage.key(index);
  }

  public has(key: T): boolean {
    const value = this.getItem(key);
    return Boolean(value);
  }
}

export { StorageBase };
