class ArrayLike<T> implements globalThis.ArrayLike<T> {
  public length: number;
  [key: number]: T;

  public constructor() {
    this.length = 0;
    Object.defineProperty(this, 'length', {
      enumerable: false,
      configurable: false,
    });
  }

  public add(idx: number, newValue: T): void {
    if (!Number.isInteger(idx)) {
      throw new TypeError("Index can't be negative");
    }
    if (!(idx in this)) {
      this.length += 1;
    }
    this[idx] = newValue;
  }

  public delete(idx: number): void {
    if (!Number.isInteger(idx)) {
      throw new TypeError("Index can't be negative");
    }
    if (idx in this) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this[idx];
      this.length -= 1;
    }
  }

  public isEmpty(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return this.length === 0;
  }

  public first(): { key: number; value: T } | undefined {
    if (this.isEmpty()) {
      return;
    }
    let n = 0;
    while (!(n in this)) {
      n++;
    }
    return { key: n, value: this[n] };
  }

  public *[Symbol.iterator](): Iterator<T> {
    for (const i in this) {
      yield this[i];
    }
  }
}

export { ArrayLike };
