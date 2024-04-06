import type {
  DatasetFindOneRepsonseDTO,
  DatasetFindOneURLParams,
  ErrorCommon,
} from '@shared/build/esm/index';
import type { UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';

import { QUERY_KEY } from '~/common/constants';
import { useQuery } from '~/common/hooks';

import { datasetApi } from '../api';

type UseOpenDataset = ({
  id,
}: DatasetFindOneURLParams) => UseQueryResult<
  DatasetFindOneRepsonseDTO,
  ErrorCommon
>;

const useOpenDataset: UseOpenDataset = ({ id }) => {
  const queryResult = useQuery<DatasetFindOneRepsonseDTO, ErrorCommon>({
    queryKey: [QUERY_KEY.FIND_ONE_DATASET, id],
    queryFn: ({ signal }) =>
      datasetApi.findOne.call(datasetApi, { id }, signal),
    retry: false,
  });

  useEffect(() => {
    //
  }, []);

  return queryResult;
};

export { useOpenDataset };
