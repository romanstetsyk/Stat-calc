import { useSyncExternalStore } from 'react';

import type { SessionData } from '../types';
import { SessionStore } from './session-data.package';

const sessionData = new SessionStore();

const useSessionData = (): SessionData => {
  return useSyncExternalStore(
    sessionData.subscribe.bind(sessionData),
    sessionData.getSnapshot.bind(sessionData),
  );
};

export { useSessionData };
