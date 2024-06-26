import 'allotment/dist/style.css';

import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Progress,
  useBreakpointValue,
} from '@chakra-ui/react';
import type { AllotmentHandle } from 'allotment';
import { Allotment } from 'allotment';
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { storage } from '~/framework/storage';
import { ArrowButton } from '~/modules/application/components';
import { Config } from '~/modules/application/config';
import { normalizeArray } from '~/modules/application/utils';
import { DataGridTitle } from '~/modules/data-grid/components';
import { SaveDatasetBtn } from '~/modules/datasets/components';

const DataGrid = lazy(() =>
  import('~/modules/data-grid/components/data-grid').then((module) => ({
    default: module.DataGrid,
  })),
);
const Session = lazy(() =>
  import('~/modules/session/components/session').then((module) => ({
    default: module.Session,
  })),
);

const SplitPanes = (): JSX.Element => {
  const ref = useRef<AllotmentHandle | null>(null);

  const [showSessionMobile, setShowSessionMobile] = useState<boolean>(() => {
    const saved = storage.getItem('show-session-mobile');
    return saved ? JSON.parse(saved) : Config.SHOW_SESSION_MOBILE;
  });

  const [showDataset, setShowDataset] = useState<boolean>(() => {
    const saved = storage.getItem('show-dataset');
    return saved ? JSON.parse(saved) : Config.SHOW_DATASET;
  });

  const [showSession, setShowSession] = useState<boolean>(() => {
    const saved = storage.getItem('show-session');
    return saved ? JSON.parse(saved) : Config.SHOW_SESSION;
  });

  const [paneSizes, setPaneSizes] = useState<number[]>(() => {
    const saved = storage.getItem('pane-sizes');
    return saved ? JSON.parse(saved) : Config.PANE_SIZES;
  });

  const smallScreen = useBreakpointValue(
    { base: true, md: false },
    { ssr: false },
  );

  const handleShowSessionMobile = useCallback((): void => {
    setShowSessionMobile(true);
  }, []);

  const handleHideSessionMobile = useCallback((): void => {
    setShowSessionMobile(false);
  }, []);

  const handleShowDataset = useCallback((): void => {
    setShowDataset(true);
  }, []);

  const handleShowSession = useCallback((): void => {
    setShowSession(true);
  }, []);

  const handleOnDragEnd = useCallback((sizes: number[]): void => {
    if (sizes.every(Boolean)) {
      setPaneSizes(sizes);
    }
  }, []);

  const handleOnVisibleChange = useCallback(
    (index: number, value: boolean): void => {
      const panes = ['dataset', 'session'] as const;
      switch (panes[index]) {
        case 'dataset': {
          setShowDataset(value);
          break;
        }
        case 'session': {
          setShowSession(value);
          break;
        }
        default: {
          throw new Error('Unknown allotment pane');
        }
      }
    },
    [],
  );

  useEffect(() => {
    storage.setItem('show-dataset', JSON.stringify(showDataset));
  }, [showDataset]);

  useEffect(() => {
    storage.setItem('show-session', JSON.stringify(showSession));
  }, [showSession]);

  useEffect(() => {
    storage.setItem('show-session-mobile', JSON.stringify(showSessionMobile));
  }, [showSessionMobile]);

  useEffect(() => {
    storage.setItem('pane-sizes', JSON.stringify(paneSizes));
  }, [paneSizes]);

  // Needed to save allotment sizes when screen changes to small and back
  useEffect(() => {
    let id: NodeJS.Timeout;
    if (!smallScreen) {
      // settimeout necessary to run after allotment finishes the layout process
      id = setTimeout(() => {
        ref.current?.reset(); // reset to preferred size
      });
    }
    return () => {
      clearTimeout(id);
    };
  }, [smallScreen]);

  const [leftPaneSize, rightPaneSize] = normalizeArray(paneSizes);

  return (
    <Suspense
      fallback={
        <Progress size='xs' isIndeterminate colorScheme='progressColorScheme' />
      }
    >
      <Allotment
        ref={ref}
        snap
        onDragEnd={handleOnDragEnd}
        onVisibleChange={handleOnVisibleChange}
      >
        <Allotment.Pane
          minSize={Config.PANE_MIN_WIDTH}
          visible={smallScreen ? !showSessionMobile : showDataset}
          preferredSize={`${leftPaneSize}%`}
        >
          <Card minW='10rem' maxW='full' height='100%' m={2}>
            <CardHeader py={3} display='flex' alignItems='center' gap={2}>
              <DataGridTitle size='sm' />
              <SaveDatasetBtn />
            </CardHeader>
            <CardBody overflow='auto' px={0} pt={0} pb={2}>
              <DataGrid />
            </CardBody>
          </Card>
        </Allotment.Pane>
        <Allotment.Pane
          minSize={Config.PANE_MIN_WIDTH}
          visible={smallScreen ? showSessionMobile : showSession}
          preferredSize={`${rightPaneSize}%`}
        >
          <Card minW='10rem' maxW='full' height='100%' m={2}>
            <CardHeader py={3} display='flex' alignItems='center'>
              <Heading size='sm' height={8} display='flex' alignItems='center'>
                Session
              </Heading>
            </CardHeader>
            {/* Without Suspense component crashes on session save */}
            <Suspense
              fallback={
                <Progress
                  size='xs'
                  isIndeterminate
                  colorScheme='progressColorScheme'
                />
              }
            >
              <Session />
            </Suspense>
          </Card>
        </Allotment.Pane>
      </Allotment>

      {smallScreen && !showSessionMobile && (
        <ArrowButton placement='right' onClick={handleShowSessionMobile} />
      )}

      {smallScreen && showSessionMobile && (
        <ArrowButton placement='left' onClick={handleHideSessionMobile} />
      )}

      {!smallScreen && !showDataset && (
        <ArrowButton placement='left' onClick={handleShowDataset} />
      )}

      {!smallScreen && !showSession && (
        <ArrowButton placement='right' onClick={handleShowSession} />
      )}
    </Suspense>
  );
};

export { SplitPanes };
