import { Heading } from "@chakra-ui/react";
import { DataTable } from "~/components/DataTable";
import {
  HypothesisNotation,
  PopulationMean,
} from "~/components/HypothesisNotation";
import { Perform } from "~/Types";
import { CIColumns, HTColumns, OutputReturn, SampleStatistics } from "./types";

export const OutputContent = ({ formSummary, outputData }: OutputReturn) => {
  if (outputData.perform === Perform.HypothesisTest) {
    const { alternative, nullValue } = formSummary;
    const { HTData, HTStats, CIData, CIStats } = outputData;

    return (
      <>
        <HypothesisNotation
          param={<PopulationMean />}
          h1dir={alternative}
          h1val={nullValue}
        />
        <Heading size="xs" as="h5" my={2}>
          Hypothesis Test Result
        </Heading>
        <DataTable<HTColumns | SampleStatistics, "">
          data={HTData}
          stats={HTStats}
        />
        {CIData && CIStats && (
          <>
            <Heading size="xs" as="h5" my={2}>
              Confidence Interval
            </Heading>
            <DataTable<CIColumns, ""> data={CIData} stats={CIStats} />
          </>
        )}
      </>
    );
  } else if (outputData.perform === Perform.ConfidenceInerval) {
    const { CIData, CIStats } = outputData;

    return (
      <>
        <Heading size="xs" as="h5" mb={2}>
          Confidence Interval
        </Heading>
        <DataTable<CIColumns | SampleStatistics, "">
          data={CIData}
          stats={CIStats}
        />
      </>
    );
  } else {
    return null;
  }
};
