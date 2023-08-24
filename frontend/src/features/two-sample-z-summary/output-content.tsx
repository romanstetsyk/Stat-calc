import { Heading } from '@chakra-ui/react';

import { DataTable } from '~/components/data-table';
import {
  HypothesisNotation,
  PopulationMeanDiff,
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
      const { alternative, nullValue } = formSummary;
      const { HTData, HTStats, CIData, CIStats, sampleData, sampleStats } =
        outputData;
      return (
        <>
          <HypothesisNotation
            param={<PopulationMeanDiff />}
            h1dir={alternative}
            h1val={nullValue}
          />
          <Heading size='xs' as='h5' my={2}>
            Hypothesis Test Result
          </Heading>
          <DataTable<HTColumns, ''> data={HTData} stats={HTStats} />
          {CIData && CIStats && (
            <>
              <Heading size='xs' as='h5' my={2}>
                Confidence Interval
              </Heading>
              <DataTable<CIColumns, ''> data={CIData} stats={CIStats} />
            </>
          )}
          {sampleData && sampleStats && (
            <>
              <Heading size='xs' as='h5' my={2}>
                Sample Summary
              </Heading>
              <DataTable<SampleStatistics, ''>
                data={sampleData}
                stats={sampleStats}
              />
            </>
          )}
        </>
      );
    }

    case Perform.ConfidenceInerval: {
      const { CIData, CIStats, sampleData, sampleStats } = outputData;
      return (
        <>
          <Heading size='xs' as='h5' mb={2}>
            Confidence Interval
          </Heading>
          <DataTable<CIColumns, ''> data={CIData} stats={CIStats} />

          {sampleData && sampleStats && (
            <>
              <Heading size='xs' as='h5' my={2}>
                Sample Summary
              </Heading>
              <DataTable<SampleStatistics, ''>
                data={sampleData}
                stats={sampleStats}
              />
            </>
          )}
        </>
      );
    }

    default: {
      throw new Error('unknow perform type');
    }
  }
};

export { OutputContent };
