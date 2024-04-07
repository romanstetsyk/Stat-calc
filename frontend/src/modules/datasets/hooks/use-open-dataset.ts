import type {
  DatasetFindOneRepsonseDTO,
  DatasetFindOneURLParams,
  ErrorCommon,
} from '@shared/build/esm/index';
import type { UseQueryResult } from '@tanstack/react-query';

import { QUERY_KEY } from '~/common/constants';
import { useQuery } from '~/common/hooks';

import { datasetApi } from '../api';

type UseOpenDataset = (
  params: DatasetFindOneURLParams,
) => UseQueryResult<DatasetFindOneRepsonseDTO, ErrorCommon>;

const useOpenDataset: UseOpenDataset = (params) => {
  return useQuery<DatasetFindOneRepsonseDTO, ErrorCommon>({
    queryKey: [QUERY_KEY.FIND_ONE_DATASET, params.id],
    queryFn: ({ signal }) =>
      datasetApi.findOne.call(datasetApi, params, signal),
    retry: false,
    gcTime: 0,
    staleTime: 0,
  });
};

export { useOpenDataset };
