export class ArrayLike<T> implements ArrayLike<T> {
  public length;
  [key: number]: T;

  constructor() {
    this.length = 0;
    Object.defineProperty(this, "length", {
      enumerable: false,
      configurable: false,
    });
  }

  add(idx: number, newValue: T) {
    if (!Number.isInteger(idx)) {
      throw new Error("Index can't be negative");
    }
    if (!(idx in this)) {
      this.length += 1;
    }
    this[idx] = newValue;
  }

  delete(idx: number) {
    if (!Number.isInteger(idx)) {
      throw new Error("Index can't be negative");
    }
    if (idx in this) {
      delete this[idx];
      this.length -= 1;
    }
  }
}
