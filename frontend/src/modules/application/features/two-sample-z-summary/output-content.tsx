import { Flex, Heading } from '@chakra-ui/react';

import {
  DataTable,
  HypothesisNotationDisplay,
  PopulationMeanDifference,
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
      const { HTData, HTStats, CIData, CIStats, sampleData, sampleStats } =
        outputData;
      return (
        <Flex flexDirection='column' gap={2}>
          <HypothesisNotationDisplay
            param={<PopulationMeanDifference />}
            h1dir={alternative}
            h1val={nullValue}
          />
          <Heading size='xs' as='h5'>
            Hypothesis Test Result
          </Heading>
          <DataTable<HTColumns, ''> data={HTData} stats={HTStats} />
          {CIData && CIStats && (
            <>
              <Heading size='xs' as='h5'>
                Confidence Interval
              </Heading>
              <DataTable<CIColumns, ''> data={CIData} stats={CIStats} />
            </>
          )}
          {sampleData && sampleStats && (
            <>
              <Heading size='xs' as='h5'>
                Sample Summary
              </Heading>
              <DataTable<SampleStatistics, ''>
                data={sampleData}
                stats={sampleStats}
              />
            </>
          )}
        </Flex>
      );
    }

    case Perform.ConfidenceInerval: {
      const { CIData, CIStats, sampleData, sampleStats } = outputData;
      return (
        <Flex flexDirection='column' gap={2}>
          <Heading size='xs' as='h5'>
            Confidence Interval
          </Heading>
          <DataTable<CIColumns, ''> data={CIData} stats={CIStats} />

          {sampleData && sampleStats && (
            <>
              <Heading size='xs' as='h5'>
                Sample Summary
              </Heading>
              <DataTable<SampleStatistics, ''>
                data={sampleData}
                stats={sampleStats}
              />
            </>
          )}
        </Flex>
      );
    }

    default: {
      throw new Error('unknow perform type');
    }
  }
};

export { OutputContent };
