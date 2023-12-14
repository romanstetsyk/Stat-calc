import type { TSession } from '~/types';

type SessionData = {
  session: TSession[];
  addSessionItem: (item: TSession) => void;
  removeSessionItem: (id: string) => void;
  updateSessionItem: (newItem: TSession) => void;
};

export type { SessionData };
