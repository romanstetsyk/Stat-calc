import { Flex, Heading } from '@chakra-ui/react';

import {
  DataTable,
  HypothesisNotationDisplay,
  PopulationMean,
} from '~/modules/application/components';
import { Perform } from '~/modules/application/enums';

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
        <Flex flexDirection='column' gap={2}>
          <HypothesisNotationDisplay
            param={<PopulationMean />}
            h1dir={alternative}
            h1val={nullValue}
          />
          <Heading size='xs' as='h5'>
            Hypothesis Test Result
          </Heading>
          <DataTable<HTColumns | SampleStatistics>
            data={HTData}
            stats={HTStats}
          />
          {CIData && CIStats && (
            <>
              <Heading size='xs' as='h5'>
                Confidence Interval
              </Heading>
              <DataTable<CIColumns> data={CIData} stats={CIStats} />
            </>
          )}
        </Flex>
      );
    }

    case Perform.ConfidenceInerval: {
      const { CIData, CIStats } = outputData;

      return (
        <Flex flexDirection='column' gap={2}>
          <Heading size='xs' as='h5'>
            Confidence Interval
          </Heading>
          <DataTable<CIColumns | SampleStatistics>
            data={CIData}
            stats={CIStats}
          />
        </Flex>
      );
    }

    default: {
      throw new Error('unknow perform type');
    }
  }
};

export { OutputContent };
