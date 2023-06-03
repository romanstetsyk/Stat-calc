import { createContext, useState } from "react";
import { DescriptiveStatisticsSession } from "../features/DescriptiveStatistics/types";

const useProvideSession = () => {
  const [session, setSession] = useState<DescriptiveStatisticsSession[]>([]);

  const addSessionItem = (item: DescriptiveStatisticsSession) => {
    setSession((prev) => prev.concat(item));
  };
  return { session, setSession, addSessionItem };
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
