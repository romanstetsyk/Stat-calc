import { StatModal as DescriptiveStatisticsModal } from '~/modules/application/features/descriptive-statistics/stat-modal';
import { StatModal as FrequencyDistributionModal } from '~/modules/application/features/frequency-distribution/stat-modal';
import { StatModal as GroupNumericDataModal } from '~/modules/application/features/group-numeric-data/stat-modal';
import { StatModal as HistogramModal } from '~/modules/application/features/histogram/stat-modal';
import { StatModal as OneSampleZDataModal } from '~/modules/application/features/one-sample-z-data/stat-modal';
import { StatModal as OneSampleZSummaryModal } from '~/modules/application/features/one-sample-z-summary/stat-modal';
import { StatModal as TwoSampleZDataModal } from '~/modules/application/features/two-sample-z-data/stat-modal';
import { StatModal as TwoSampleZSummaryModal } from '~/modules/application/features/two-sample-z-summary/stat-modal';

import { useSessionData } from '../store';

type Props = {
  id: string;
};

const UpdateBtn = ({ id }: Props): JSX.Element => {
  const { session } = useSessionData();
  const item = session.find((item) => item.id === id);

  switch (item?.type) {
    case 'descriptive': {
      return <DescriptiveStatisticsModal id={id} />;
    }

    case 'frequencyDistribution': {
      return <FrequencyDistributionModal id={id} />;
    }

    case 'histogram': {
      return <HistogramModal id={id} />;
    }

    case 'groupNumericalData': {
      return <GroupNumericDataModal id={id} />;
    }

    case 'z1summary': {
      return <OneSampleZSummaryModal id={id} />;
    }

    case 'z1data': {
      return <OneSampleZDataModal id={id} />;
    }

    case 'z2summary': {
      return <TwoSampleZSummaryModal id={id} />;
    }

    case 'z2data': {
      return <TwoSampleZDataModal id={id} />;
    }

    default: {
      throw new Error('unknown session type');
    }
  }
};

export { UpdateBtn };
