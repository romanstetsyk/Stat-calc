import { useSyncExternalStore } from 'react';

import { SessionStore } from './session-data.package';
import type { SessionData } from './types';

const sessionData = new SessionStore();

const useSessionData = (): SessionData => {
  return useSyncExternalStore(
    sessionData.subscribe.bind(sessionData),
    sessionData.getSnapshot.bind(sessionData),
  );
};

export { useSessionData };
