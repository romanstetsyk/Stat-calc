import { useContext } from "react";
import { SessionContext } from "~/contexts/SessionContext";
import { StatModal as DescriptiveStatisticsModal } from "~/features/DescriptiveStatistics/StatModal";
import { StatModal as FrequencyDistributionModal } from "~/features/FrequencyDistribution/StatModal";
import { StatModal as GroupNumericDataModal } from "~/features/GroupNumericData/StatModal";
import { StatModal as HistogramModal } from "~/features/Histogram/StatModal";
import { StatModal as OneSampleZDataModal } from "~/features/OneSampleZData/StatModal";
import { StatModal as OneSampleZSummaryModal } from "~/features/OneSampleZSummary/StatModal";
import { StatModal as TwoSampleZSummaryModal } from "~/features/TwoSampleZSummary/StatModal";

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

    case "histogram":
      return <HistogramModal id={id} />;

    case "groupNumericalData":
      return <GroupNumericDataModal id={id} />;

    case "z1summary":
      return <OneSampleZSummaryModal id={id} />;

    case "z1data":
      return <OneSampleZDataModal id={id} />;

    case "z2summary":
      return <TwoSampleZSummaryModal id={id} />;

    default:
      throw new Error("unknown session type");
  }
};
