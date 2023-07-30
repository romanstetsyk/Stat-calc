import { Heading } from "@chakra-ui/react";
import { DataTable } from "~/components/DataTable";
import {
  HypothesisNotation,
  PopulationMeanDiff,
} from "~/components/HypothesisNotation";
import { Perform } from "~/Types";
import { CIColumns, HTColumns, OutputReturn, SampleStatistics } from "./types";

export const OutputContent = ({ formSummary, outputData }: OutputReturn) => {
  if (outputData.perform === Perform.HypothesisTest) {
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
        <Heading size="xs" as="h5" my={2}>
          Hypothesis Test Result
        </Heading>
        <DataTable<HTColumns, ""> data={HTData} stats={HTStats} />
        {CIData && CIStats && (
          <>
            <Heading size="xs" as="h5" my={2}>
              Confidence Interval
            </Heading>
            <DataTable<CIColumns, ""> data={CIData} stats={CIStats} />
          </>
        )}
        <Heading size="xs" as="h5" my={2}>
          Sample Summary
        </Heading>
        <DataTable<SampleStatistics, "">
          data={sampleData}
          stats={sampleStats}
        />
      </>
    );
  } else if (outputData.perform === Perform.ConfidenceInerval) {
    const { CIData, CIStats, sampleData, sampleStats } = outputData;

    return (
      <>
        <Heading size="xs" as="h5" mb={2}>
          Confidence Interval
        </Heading>
        <DataTable<CIColumns, ""> data={CIData} stats={CIStats} />

        <Heading size="xs" as="h5" my={2}>
          Sample Summary
        </Heading>
        <DataTable<SampleStatistics, "">
          data={sampleData}
          stats={sampleStats}
        />
      </>
    );
  } else {
    return null;
  }
};
