import {
  Button,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import type { DatasetDTO } from '@shared/build/esm/index';
import { Link as RouterLink } from 'react-router-dom';

import { bytesToKb } from '../../helpers';
import { useDeleteDataset } from '../../hooks';

type Props = {
  datasets?: DatasetDTO[];
};

const DatasetList = ({ datasets }: Props): JSX.Element | null => {
  const { mutate: deleteFile } = useDeleteDataset();

  if (!datasets) {
    return null;
  }

  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Filename</Th>
            <Th>Size</Th>
            <Th>Updated at</Th>
          </Tr>
        </Thead>
        <Tbody>
          {datasets.map(({ id, filename, size, updatedAt }) => (
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
                <Button
                  type='button'
                  onClick={() => {
                    deleteFile({ id });
                  }}
                >
                  Delete
                </Button>
              </Td>
              <Td fontSize='sm'>{bytesToKb(size)} Kb</Td>
              <Td fontSize='sm'>{new Date(updatedAt).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export { DatasetList };
