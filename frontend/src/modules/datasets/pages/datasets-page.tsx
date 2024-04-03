import { Button } from '@chakra-ui/react';
import type { DatasetUploadRequestDTO } from '@shared/build/esm/index';
import { useCallback } from 'react';

import { DatasetList } from '../components';
import { FileUploadForm } from '../forms';
import { useFindAllDatasets, useUpload } from '../hooks';

const DatasetsPage = (): JSX.Element => {
  const { mutate: uploadFile } = useUpload();
  const { data: datasets, refetch } = useFindAllDatasets();

  const onSubmit = useCallback(
    (data: DatasetUploadRequestDTO): void => {
      uploadFile(data);
    },
    [uploadFile],
  );

  return (
    <>
      <DatasetList datasets={datasets} />
      <Button type='button' onClick={() => refetch()}>
        refresh
      </Button>
      <FileUploadForm onSubmit={onSubmit} />
    </>
  );
};

export { DatasetsPage };
