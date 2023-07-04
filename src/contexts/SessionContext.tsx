import { createContext, useState } from "react";
import { TSession } from "~/Types";

const useProvideSession = () => {
  const [session, setSession] = useState<TSession[]>([]);

  const addSessionItem = (item: TSession) => {
    setSession((prev) => prev.concat(item));
  };

  const updateSessionItem = (newItem: TSession) => {
    setSession((prev) =>
      prev.map((item) => (item.id === newItem.id ? newItem : item))
    );
  };

  const removeSessionItem = (id: string) => {
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

export const SessionContext = createContext<
  ReturnType<typeof useProvideSession>
>({} as ReturnType<typeof useProvideSession>);

type Props = {
  children: React.ReactNode;
};

export const SessionProvider = ({ children }: Props) => {
  const sessionData = useProvideSession();

  return (
    <SessionContext.Provider value={sessionData}>
      {children}
    </SessionContext.Provider>
  );
};
