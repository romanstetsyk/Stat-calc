/**
 * To be used with useSyncExternalStore react hook
 */

import type { TExternalStore } from './types';

abstract class ExternalStore<T> implements TExternalStore<T> {
  protected listeners: (() => void)[] = [];

  protected abstract snapshot: T;

  public subscribe(listener: () => void): () => void {
    this.listeners = [...this.listeners, listener];
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  protected emitChange(): void {
    // The store snapshot returned by getSnapshot must be immutable.
    // If the underlying store has mutable data, return a new immutable snapshot if the data has changed.
    // Otherwise, return a cached last snapshot.
    if (this.snapshot instanceof Object) {
      this.snapshot = { ...this.snapshot };
    }

    for (const listener of this.listeners) {
      listener();
    }
  }

  public getSnapshot(): T {
    return this.snapshot;
  }
}

export { ExternalStore };
