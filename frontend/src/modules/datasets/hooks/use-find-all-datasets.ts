import type {
  DatasetFindAllResponseDTO,
  ErrorCommon,
} from '@shared/build/esm/index';
import type { UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useQuery } from '~/common/hooks';

import { datasetApi } from '../api';

const useFindAllDatasets = (): UseQueryResult<
  DatasetFindAllResponseDTO,
  ErrorCommon
> => {
  const queryResult = useQuery<DatasetFindAllResponseDTO, ErrorCommon>({
    queryKey: ['allDatasets'],
    queryFn: ({ signal }) => datasetApi.findAll(signal),
    staleTime: Number.POSITIVE_INFINITY,
  });

  const { isError, isSuccess } = queryResult;

  useEffect(() => {
    if (isError) {
      // console.log('useFindAllDatasets error');
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      // console.log('useFindAllDatasets success');
    }
  }, [isSuccess]);

  return queryResult;
};

export { useFindAllDatasets };
