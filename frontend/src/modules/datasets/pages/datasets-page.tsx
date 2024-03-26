import type { DatasetUploadRequestDTO } from '@shared/build/esm/index';
import { useCallback } from 'react';

import { DatasetList } from '../components';
import { FileUploadForm } from '../forms';
import { useFindAllDatasets, useUpload } from '../hooks';

const DatasetsPage = (): JSX.Element => {
  const { mutate: uploadFile } = useUpload();
  const { data: datasets } = useFindAllDatasets();

  const onSubmit = useCallback(
    (data: DatasetUploadRequestDTO): void => {
      uploadFile(data);
    },
    [uploadFile],
  );

  return (
    <>
      <DatasetList datasets={datasets} />
      <FileUploadForm onSubmit={onSubmit} />
    </>
  );
};

export { DatasetsPage };
