import { createContext, useState } from 'react';

import type { TSession } from '~/types';

const useProvideSession = (): {
  session: TSession[];
  setSession: React.Dispatch<React.SetStateAction<TSession[]>>;
  addSessionItem: (item: TSession) => void;
  removeSessionItem: (id: string) => void;
  updateSessionItem: (newItem: TSession) => void;
} => {
  const [session, setSession] = useState<TSession[]>([]);

  const addSessionItem = (item: TSession): void => {
    setSession((prev) => [...prev, item]);
  };

  const updateSessionItem = (newItem: TSession): void => {
    setSession((prev) =>
      prev.map((item) => (item.id === newItem.id ? newItem : item)),
    );
  };

  const removeSessionItem = (id: string): void => {
    setSession((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    session,
    setSession,
    addSessionItem,
    removeSessionItem,
    updateSessionItem,
  };
};

const SessionContext = createContext<ReturnType<typeof useProvideSession>>(
  {} as ReturnType<typeof useProvideSession>,
);

type Props = {
  children: React.ReactNode;
};

const SessionProvider = ({ children }: Props): JSX.Element => {
  const sessionData = useProvideSession();

  return (
    <SessionContext.Provider value={sessionData}>
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };
