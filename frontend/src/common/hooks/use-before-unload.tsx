import { useEffect } from 'react';

type BeforeUnloadTriggers = 'data' | 'session';

const listeners = new Set<BeforeUnloadTriggers>();

const beforeUnloadHandler = (e: BeforeUnloadEvent): void => {
  e.preventDefault();
  e.returnValue = true;
};

const useBeforeUnload = (key: BeforeUnloadTriggers, value: boolean): void => {
  useEffect(() => {
    value ? listeners.add(key) : listeners.delete(key);

    listeners.size > 0
      ? window.addEventListener('beforeunload', beforeUnloadHandler)
      : window.removeEventListener('beforeunload', beforeUnloadHandler);

    return () => {
      listeners.delete(key);

      if (listeners.size === 0) {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      }
    };
  }, [key, value]);
};

export { useBeforeUnload };
