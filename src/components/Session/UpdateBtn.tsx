import { useContext } from "react";
import { StatModal as DescriptiveStatisticsModal } from "src/features/DescriptiveStatistics/StatModal";
import { SessionContext } from "src/contexts/SessionContext";

type Props = {
  id: string;
};

export const UpdateBtn = ({ id }: Props) => {
  const { session } = useContext(SessionContext);
  const item = session.find(({ outputId }) => outputId === id);

  switch (item?.type) {
    case "descriptive":
      return <DescriptiveStatisticsModal id={id} />;

    case "frequencyDistribution":
      console.log("frequencyDistribution update");
      break;

    default:
      throw new Error("unknown session type");
  }
};
