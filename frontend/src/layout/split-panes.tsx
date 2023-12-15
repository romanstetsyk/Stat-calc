/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import 'allotment/dist/style.css';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import type { AllotmentHandle } from 'allotment';
import { Allotment } from 'allotment';
import { useEffect, useRef, useState } from 'react';

import { DataGrid } from '~/modules/data-grid/components';
import { Session } from '~/modules/session/components';

const DEFAULT = {
  showSessionMobile: false,
  showGrid: true,
  showSession: true,
  sizes: [2, 1],
};

const SplitPanes = (): JSX.Element => {
  const ref = useRef<AllotmentHandle | null>(null);

  const [showSessionMobile, setShowSessionMobile] = useState<boolean>(() => {
    const saved = window.localStorage.getItem('showSessionMobile');
    return typeof saved === 'string'
      ? JSON.parse(saved)
      : DEFAULT.showSessionMobile;
  });

  const [showGrid, setShowGrid] = useState<boolean>(() => {
    const saved = window.localStorage.getItem('showGrid');
    return typeof saved === 'string' ? JSON.parse(saved) : DEFAULT.showGrid;
  });

  const [showSession, setShowSession] = useState<boolean>(() => {
    const saved = window.localStorage.getItem('showSession');
    return typeof saved === 'string' ? JSON.parse(saved) : DEFAULT.showSession;
  });

  const [sizes, setSizes] = useState<number[]>(() => {
    const saved = window.localStorage.getItem('sizes');
    return typeof saved === 'string' ? JSON.parse(saved) : DEFAULT.sizes;
  });

  const smallScreen = useBreakpointValue(
    { base: true, md: false },
    { ssr: false },
  );

  useEffect(() => {
    window.localStorage.setItem('showGrid', JSON.stringify(showGrid));
  }, [showGrid]);

  useEffect(() => {
    window.localStorage.setItem('showSession', JSON.stringify(showSession));
  }, [showSession]);

  useEffect(() => {
    window.localStorage.setItem(
      'showSessionMobile',
      JSON.stringify(showSessionMobile),
    );
  }, [showSessionMobile]);

  useEffect(() => {
    window.localStorage.setItem('sizes', JSON.stringify(sizes));
  }, [sizes]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (!smallScreen) {
      // settimeout necessary to run after allotment finishes the layout process
      id = setTimeout(() => {
        ref.current?.reset(); // reset to preferred size
      }, 0);
    }
    return () => {
      clearTimeout(id);
    };
  }, [sizes, smallScreen]);

  return (
    <>
      <Allotment
        ref={ref}
        snap
        onDragEnd={setSizes}
        onVisibleChange={(_index, value): void => {
          switch (_index) {
            case 0: {
              setShowGrid(value);
              break;
            }
            case 1: {
              setShowSession(value);
              break;
            }
            default: {
              throw new Error('unknown allotment pane');
            }
          }
        }}
      >
        <Allotment.Pane
          minSize={200}
          visible={smallScreen ? !showSessionMobile : showGrid}
          preferredSize={`${((100 * sizes[0]) / (sizes[0] + sizes[1])).toFixed(
            2,
          )}%`}
        >
          <Card minW='10rem' maxW='full' height='100%' m={2}>
            <CardHeader pb={0}>
              <Heading size='md'>Untitled</Heading>
            </CardHeader>
            <CardBody overflow='scroll' px={0}>
              <DataGrid />
            </CardBody>
          </Card>
        </Allotment.Pane>
        <Allotment.Pane
          minSize={200}
          visible={smallScreen ? showSessionMobile : showSession}
          preferredSize={`${((100 * sizes[1]) / (sizes[0] + sizes[1])).toFixed(
            2,
          )}%`}
        >
          <Card minW='10rem' maxW='full' height='100%' m={2}>
            <CardHeader>
              <Heading size='md'>Session</Heading>
            </CardHeader>
            <Session />
          </Card>
        </Allotment.Pane>
      </Allotment>

      {!showSessionMobile && smallScreen && (
        <IconButton
          zIndex={1}
          width='max-content'
          position='fixed'
          top='50%'
          right='0'
          onClick={(): void => {
            setShowSessionMobile(true);
          }}
          aria-label='Add to friends'
          icon={<ChevronLeftIcon />}
        />
      )}
      {showSessionMobile && smallScreen && (
        <IconButton
          zIndex={1}
          width='max-content'
          position='fixed'
          top='50%'
          left='0'
          onClick={(): void => {
            setShowSessionMobile(false);
          }}
          aria-label='Add to friends'
          icon={<ChevronRightIcon />}
        />
      )}

      {!smallScreen && !showGrid && (
        <IconButton
          zIndex={1}
          width='max-content'
          position='fixed'
          top='50%'
          left='0'
          onClick={(): void => {
            setShowGrid(true);
          }}
          aria-label='Add to friends'
          icon={<ChevronRightIcon />}
        />
      )}

      {!smallScreen && !showSession && (
        <IconButton
          zIndex={1}
          width='max-content'
          position='fixed'
          top='50%'
          right='0'
          onClick={(): void => {
            setShowSession(true);
          }}
          aria-label='Add to friends'
          icon={<ChevronLeftIcon />}
        />
      )}
    </>
  );
};

// eslint-disable-next-line import/no-default-export
export default SplitPanes;
