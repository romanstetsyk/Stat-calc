import { Flex } from '@chakra-ui/react';
import type { DatasetUploadRequestDTO } from '@shared/build/esm/index';
import { useCallback } from 'react';

import { DatasetsTable, EmptyTableAlert } from '../components';
import { FileUploadForm } from '../forms';
import { useFindAllDatasets, useUpload } from '../hooks';

const DatasetsPage = (): JSX.Element => {
  const { mutate: uploadFile } = useUpload();
  const { data: datasets, isSuccess } = useFindAllDatasets();

  const onSubmit = useCallback(
    (data: DatasetUploadRequestDTO): void => {
      uploadFile(data);
    },
    [uploadFile],
  );

  return (
    <Flex flexDirection='column' gap={16}>
      {isSuccess &&
        (datasets.length === 0 ? (
          <EmptyTableAlert />
        ) : (
          <DatasetsTable datasets={datasets} />
        ))}

      <FileUploadForm onSubmit={onSubmit} />
    </Flex>
  );
};

// eslint-disable-next-line import/no-default-export
export default DatasetsPage;
