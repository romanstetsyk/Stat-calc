import type { DatasetUploadRequestDTO } from '@shared/build/esm/index';
import { useCallback } from 'react';

import { FileUploadForm } from '../forms/file-upload-form';
import { useFindAllDatasets, useUpload } from '../hooks';

const DatasetsPage = (): JSX.Element => {
  const { mutate: uploadFile } = useUpload();
  const { data: allDatasets } = useFindAllDatasets();

  const onSubmit = useCallback(
    (data: DatasetUploadRequestDTO): void => {
      uploadFile(data);
    },
    [uploadFile],
  );

  return (
    <>
      <ul>{allDatasets?.map((d, i) => <li key={i}>{d}</li>)}</ul>
      <FileUploadForm onSubmit={onSubmit} />
    </>
  );
};

export { DatasetsPage };
