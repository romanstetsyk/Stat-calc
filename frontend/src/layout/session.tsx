import { CardBody, Text } from '@chakra-ui/react';
import Muuri from 'muuri';
import { useRef } from 'react';
import type { DraggableGridHandle } from 'ruuri';
import DraggableGrid from 'ruuri';

import { DataTable } from '~/components/data-table';
import { SessionItemWrapper } from '~/components/session/session-item-wrapper';
import type { SampleStatistics } from '~/features/descriptive-statistics/types';
import { OutputContent as FrequencyDistOutputContent } from '~/features/frequency-distribution/output-content';
import { OutputContent as GroupedDataOutputContent } from '~/features/group-numeric-data/output-content';
import { OutputContent as HistogramOutputContent } from '~/features/histogram/output-content';
import { OutputContent as Z1DataOutputContent } from '~/features/one-sample-z-data/output-content';
import { OutputContent as Z1SummaryOutputContent } from '~/features/one-sample-z-summary/output-content';
import { OutputContent as Z2DataOutputContent } from '~/features/two-sample-z-data/output-content';
import { OutputContent as Z2SummaryOutputContent } from '~/features/two-sample-z-summary/output-content';
import { useSessionData } from '~/store/session-data';
import type { TSession } from '~/types';
import { layoutFunction } from '~/utils/layout-function';

const Session = (): JSX.Element => {
  const { session } = useSessionData();

  const gridRef = useRef<DraggableGridHandle | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  if (session.length === 0) {
    return <Text m={5}>No data</Text>;
  }

  return (
    <CardBody overflow='scroll' p={0} ref={divRef}>
      <DraggableGrid
        style={{
          backgroundSize: '0.5in 0.5in',
          backgroundImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px)',
        }}
        ref={gridRef}
        layout={layoutFunction}
        onDragEnd={(): Muuri | undefined =>
          gridRef.current?.grid?.refreshItems().layout()
        }
        dragEnabled
        dragSort={true}
        dragAutoScroll={{
          targets: () => [
            { element: window, priority: 0 },
            { element: divRef.current ?? window, priority: 1 },
          ],
          sortDuringScroll: false,
          threshold: 0,
          safeZone: 0.5,
          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          handle: Muuri.AutoScroller.pointerHandle(500),
        }}
        dragContainer={
          document.querySelector('#dragContainer') as HTMLDivElement
        }
        dragHandle='.draggableHeader'
        // dragStartPredicate={{ delay: 200 }}
        uniKey='id'
        data={session}
        renderItem={(item: TSession): React.ReactNode => {
          switch (item.type) {
            case 'descriptive': {
              const { id, title, data, stats, timestamp } = item;
              return (
                <SessionItemWrapper
                  key={id}
                  id={id}
                  title={title}
                  gridRef={gridRef}
                >
                  <CardBody px={3} py={2} overflow='auto'>
                    <DataTable<SampleStatistics, ''>
                      data={data}
                      stats={stats}
                      key={timestamp} // remount component to auto update col widths
                    />
                  </CardBody>
                </SessionItemWrapper>
              );
            }
            case 'frequencyDistribution': {
              const { id, title, data, timestamp } = item;
              return (
                <SessionItemWrapper
                  key={id}
                  id={id}
                  title={title}
                  gridRef={gridRef}
                >
                  <CardBody
                    px={3}
                    py={2}
                    display='flex'
                    gap={4}
                    flexDirection='column'
                    overflow='auto'
                  >
                    <FrequencyDistOutputContent
                      outputData={data}
                      key={timestamp}
                    />
                  </CardBody>
                </SessionItemWrapper>
              );
            }
            case 'histogram': {
              const { id, title, data, timestamp } = item;
              return (
                <SessionItemWrapper
                  key={id}
                  id={id}
                  title={title}
                  gridRef={gridRef}
                >
                  <CardBody
                    px={3}
                    py={2}
                    display='flex'
                    gap={4}
                    flexDirection='column'
                    overflow='auto'
                  >
                    <HistogramOutputContent outputData={data} key={timestamp} />
                  </CardBody>
                </SessionItemWrapper>
              );
            }
            case 'groupNumericalData': {
              const { id, title, data, timestamp } = item;
              return (
                <SessionItemWrapper
                  key={id}
                  id={id}
                  title={title}
                  gridRef={gridRef}
                >
                  <CardBody
                    px={3}
                    py={2}
                    display='flex'
                    gap={4}
                    flexDirection='column'
                    overflow='auto'
                  >
                    <GroupedDataOutputContent
                      outputData={data}
                      key={timestamp}
                    />
                  </CardBody>
                </SessionItemWrapper>
              );
            }
            case 'z1summary': {
              const { id, title, data, timestamp, formSummary } = item;
              return (
                <SessionItemWrapper
                  key={id}
                  id={id}
                  title={title}
                  gridRef={gridRef}
                >
                  <CardBody px={3} py={2} overflow='auto'>
                    <Z1SummaryOutputContent
                      outputData={data}
                      formSummary={formSummary}
                      key={timestamp}
                    />
                  </CardBody>
                </SessionItemWrapper>
              );
            }
            case 'z1data': {
              const { id, title, data, timestamp, formSummary } = item;
              return (
                <SessionItemWrapper
                  key={id}
                  id={id}
                  title={title}
                  gridRef={gridRef}
                >
                  <CardBody px={3} py={2} overflow='auto'>
                    <Z1DataOutputContent
                      outputData={data}
                      formSummary={formSummary}
                      key={timestamp}
                    />
                  </CardBody>
                </SessionItemWrapper>
              );
            }
            case 'z2summary': {
              const { id, title, data, timestamp, formSummary } = item;
              return (
                <SessionItemWrapper
                  key={id}
                  id={id}
                  title={title}
                  gridRef={gridRef}
                >
                  <CardBody px={3} py={2} overflow='auto'>
                    <Z2SummaryOutputContent
                      outputData={data}
                      formSummary={formSummary}
                      key={timestamp}
                    />
                  </CardBody>
                </SessionItemWrapper>
              );
            }
            case 'z2data': {
              const { id, title, data, timestamp, formSummary } = item;
              return (
                <SessionItemWrapper
                  key={id}
                  id={id}
                  title={title}
                  gridRef={gridRef}
                >
                  <CardBody px={3} py={2} overflow='auto'>
                    <Z2DataOutputContent
                      outputData={data}
                      formSummary={formSummary}
                      key={timestamp}
                    />
                  </CardBody>
                </SessionItemWrapper>
              );
            }
            default: {
              // eslint-disable-next-line no-console
              console.error('Unknown session type');
            }
          }
        }}
      />
    </CardBody>
  );
};

export { Session };
