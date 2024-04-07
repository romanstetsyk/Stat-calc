import { Link, Td, Tr } from '@chakra-ui/react';
import type { DatasetDTO } from '@shared/build/esm/index';
import { Link as RouterLink } from 'react-router-dom';

import { formatFileSize } from '~/common/helpers';

import { DeleteDatasetBtn } from './delete-dataset-btn';
import { DownloadDatasetBtn } from './download-dataset-btn';

type Props = {
  dataset: DatasetDTO;
  onDelete: (id: string) => () => void;
};

const DatasetsTableRow = ({ dataset, onDelete }: Props): JSX.Element => {
  const { id, filename, size, updatedAt } = dataset;

  return (
    <Tr key={id}>
      <Td isTruncated maxWidth='sm' title={filename}>
        <Link
          as={RouterLink}
          to={{ pathname: id }}
          target='_blank'
          rel='noreferrer noopener'
        >
          {filename}
        </Link>
      </Td>
      <Td fontSize='sm' isNumeric>
        {formatFileSize(size, 1)}
      </Td>
      <Td fontSize='sm' isNumeric>
        {new Date(updatedAt).toLocaleString()}
      </Td>
      <Td isNumeric>
        <DownloadDatasetBtn id={id} />
        <DeleteDatasetBtn onClick={onDelete(id)} />
      </Td>
    </Tr>
  );
};

export { DatasetsTableRow };
