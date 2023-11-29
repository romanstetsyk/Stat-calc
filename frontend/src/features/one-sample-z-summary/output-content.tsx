import { Heading } from '@chakra-ui/react';

import { DataTable } from '~/components/data-table';
import {
  HypothesisNotation,
  PopulationMean,
} from '~/components/hypothesis-notation';
import { Perform } from '~/types';

import type {
  CIColumns,
  HTColumns,
  OutputReturn,
  SampleStatistics,
} from './types';

const OutputContent = ({
  formSummary,
  outputData,
}: OutputReturn): JSX.Element => {
  switch (outputData.perform) {
    case Perform.HypothesisTest: {
      const { alternative, nullValue } = formSummary.hypothesisTest;
      const { HTData, HTStats, CIData, CIStats } = outputData;

      return (
        <>
          <HypothesisNotation
            param={<PopulationMean />}
            h1dir={alternative}
            h1val={nullValue}
          />
          <Heading size='xs' as='h5' my={2}>
            Hypothesis Test Result
          </Heading>
          <DataTable<HTColumns | SampleStatistics>
            data={HTData}
            stats={HTStats}
          />
          {CIData && CIStats && (
            <>
              <Heading size='xs' as='h5' my={2}>
                Confidence Interval
              </Heading>
              <DataTable<CIColumns> data={CIData} stats={CIStats} />
            </>
          )}
        </>
      );
    }

    case Perform.ConfidenceInerval: {
      const { CIData, CIStats } = outputData;

      return (
        <>
          <Heading size='xs' as='h5' mb={2}>
            Confidence Interval
          </Heading>
          <DataTable<CIColumns | SampleStatistics>
            data={CIData}
            stats={CIStats}
          />
        </>
      );
    }

    default: {
      throw new Error('unknow perform type');
    }
  }
};

export { OutputContent };
