import { useContext } from "react";
import { SessionContext } from "src/contexts/SessionContext";
import { StatModal as DescriptiveStatisticsModal } from "src/features/DescriptiveStatistics/StatModal";
import { StatModal as FrequencyDistributionModal } from "src/features/FrequencyDistribution/StatModal";

type Props = {
  id: string;
};

export const UpdateBtn = ({ id }: Props) => {
  const { session } = useContext(SessionContext);
  const item = session.find((item) => item.id === id);

  switch (item?.type) {
    case "descriptive":
      return <DescriptiveStatisticsModal id={id} />;

    case "frequencyDistribution":
      return <FrequencyDistributionModal id={id} />;

    default:
      throw new Error("unknown session type");
  }
};
