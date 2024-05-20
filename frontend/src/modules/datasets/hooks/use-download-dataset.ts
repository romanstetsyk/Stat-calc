import type { ToastId } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import type {
  DatasetFindOneRepsonseDTO,
  DatasetFindOneURLParams,
  ErrorCommon,
} from '@shared/build/esm/index';
import type { UseQueryResult } from '@tanstack/react-query';
import throttle from 'lodash-es/throttle';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { QUERY_KEY } from '~/common/constants';
import { useQuery, useQueryClient } from '~/common/hooks';

import { datasetApi } from '../api';

type FetchEventDTO = {
  received: number;
  length: number;
  done: boolean;
  options: { id: string };
};

const ProgressLimits = {
  MIN: 0,
  MAX: 100,
} as const;
// throttle updating progress
const THROTTLE_WAIT = 100;
// Change icon from progress to download
const RESET_ICON_TIMEOUT = 2000;

type UseDownloadDataset = (params: DatasetFindOneURLParams) => UseQueryResult<
  DatasetFindOneRepsonseDTO,
  ErrorCommon
> & {
  download: () => void;
  cancelQuery: () => void;
  progress: number;
  ProgressLimits: typeof ProgressLimits;
};

const useDownloadDataset: UseDownloadDataset = ({ id }) => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<number>(ProgressLimits.MIN);

  const toast = useToast();
  const toastRef = useRef<ToastId>();

  const canceled = useRef(false);

  const queryResult = useQuery<DatasetFindOneRepsonseDTO, ErrorCommon>({
    queryKey: [QUERY_KEY.FIND_ONE_DATASET, id],
    queryFn: ({ signal }) =>
      datasetApi.findOne.call(datasetApi, { id }, signal),
    retry: false,
    gcTime: 0,
    staleTime: 0,
    enabled: false,
  });

  const { isSuccess, data, isError, error, refetch } = queryResult;

  const updateProgress = useMemo(() => {
    return throttle(
      (value) => {
        if (!canceled.current) {
          setProgress(() => value);
        }
      },
      THROTTLE_WAIT,
      { leading: true, trailing: true },
    );
  }, []);

  const download = useCallback((): void => {
    canceled.current = false;
    void refetch();
  }, [refetch]);

  const cancelQuery = useCallback((): void => {
    canceled.current = true;
    setProgress(ProgressLimits.MIN);
    void queryClient.cancelQueries({
      queryKey: [QUERY_KEY.FIND_ONE_DATASET, id],
    });
  }, [id, queryClient]);

  useEffect(() => {
    let href: string;
    if (isSuccess) {
      const link = document.createElement('a');
      href = URL.createObjectURL(new Blob([data.buffer]));
      link.href = href;
      link.download = data.filename;
      link.click();
      void queryClient.resetQueries({
        queryKey: [QUERY_KEY.FIND_ONE_DATASET, id],
      });
    }
    return () => {
      href && URL.revokeObjectURL(href);
    };
  }, [data?.buffer, data?.filename, id, isSuccess, queryClient]);

  useEffect(() => {
    if (isError) {
      toastRef.current = toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: null,
        isClosable: true,
      });
    }
    return () => {
      toastRef.current && toast.close(toastRef.current);
    };
  }, [error, isError, toast]);

  useEffect(() => {
    const handler = (e: CustomEvent<FetchEventDTO>): void => {
      const { length, received, options } = e.detail;
      if (options.id === id) {
        const progress =
          (received / length) * (ProgressLimits.MAX - ProgressLimits.MIN) +
          ProgressLimits.MIN;
        updateProgress(Number(progress.toFixed(1)));
      }
    };
    window.addEventListener('fetch-progress', handler);
    return () => {
      window.removeEventListener('fetch-progress', handler);
    };
  }, [id, updateProgress]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (progress === ProgressLimits.MAX) {
      timeoutId = setTimeout(() => {
        setProgress(ProgressLimits.MIN);
      }, RESET_ICON_TIMEOUT);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [id, progress]);

  return { download, cancelQuery, progress, ProgressLimits, ...queryResult };
};

export { useDownloadDataset };
