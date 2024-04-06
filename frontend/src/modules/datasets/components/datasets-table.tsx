import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import type { DatasetDTO } from '@shared/build/esm/index';
import { useCallback } from 'react';

import { useDeleteDataset, useDownloadDataset } from '../hooks';
import { DatasetsTableRow } from './datasets-table-row';

type Props = {
  datasets: DatasetDTO[];
};

const DatasetsTable = ({ datasets }: Props): JSX.Element | null => {
  const { mutate: deleteFile } = useDeleteDataset();
  const { mutate: downloadFile } = useDownloadDataset();

  const handleDelete = useCallback(
    (id: string) => {
      return () => {
        deleteFile({ id });
      };
    },
    [deleteFile],
  );

  const handleDownload = useCallback(
    (id: string) => {
      return () => {
        downloadFile({ id });
      };
    },
    [downloadFile],
  );

  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Filename</Th>
            <Th isNumeric>Size</Th>
            <Th isNumeric>Updated at</Th>
            <Th isNumeric>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {datasets.map((dataset) => (
            <DatasetsTableRow
              key={dataset.id}
              dataset={dataset}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export { DatasetsTable };
