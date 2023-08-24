class ArrayLike<T> implements ArrayLike<T> {
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
}

export { ArrayLike };
