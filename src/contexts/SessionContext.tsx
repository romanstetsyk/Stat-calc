import { createContext, useState } from "react";
import { TSession } from "../Types";

const useProvideSession = () => {
  const [session, setSession] = useState<TSession[]>([]);

  const addSessionItem = (item: TSession) => {
    setSession((prev) => prev.concat(item));
  };

  const removeSessionItem = (outputId: string) => {
    setSession((prev) => prev.filter((item) => item.outputId !== outputId));
  };

  return { session, setSession, addSessionItem, removeSessionItem };
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
