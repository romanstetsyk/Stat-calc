import { useContext, memo } from "react";
import { SessionContext } from "../contexts/SessionContext";
import { SampleStatistics } from "../features/DescriptiveStatistics/types";
import { DataTable } from "./DataTable";

export const Session = memo(() => {
  const { session } = useContext(SessionContext);

  if (session.length === 0) {
    return null;
  }

  return (
    <div>
      {session.map(({ type, timestamp, title, data, stats }) => {
        if (type === "descriptive") {
          return (
            <div key={timestamp}>
              <p>
                {title}. Timestamp: {new Date(timestamp).toLocaleString()}
              </p>
              <DataTable<SampleStatistics, ""> data={data} stats={stats} />
            </div>
          );
        }
      })}
    </div>
  );
});
