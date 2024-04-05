import { AttachmentIcon } from '@chakra-ui/icons';
import {
  FormErrorMessage,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from '@chakra-ui/react';
import { Fragment } from 'react';
import type { FieldError } from 'react-hook-form';

import { formatFileSize } from '~/common/helpers';

import { DeleteFile } from './delete-file';
import type { FileWithKey } from './types';

type Props = {
  files: FileWithKey[];
  onDelete: (key: FileWithKey['key']) => () => void;
  error: FieldError | undefined;
};

const SelectedFileList = ({ files, onDelete, error }: Props): JSX.Element => {
  return (
    <TableContainer p={2}>
      <Table size='sm'>
        <Tbody>
          {files.map(({ key, file }, idx) => {
            const hasError = Array.isArray(error) && error[idx];
            return (
              <Fragment key={key}>
                <Tr>
                  <Td
                    borderBottom={hasError ? 'none' : undefined}
                    pb={hasError ? 0 : undefined}
                  >
                    <AttachmentIcon mr={2} />
                    <span>{file.name}</span>
                  </Td>
                  <Td
                    isNumeric
                    borderBottom={hasError ? 'none' : undefined}
                    pb={hasError ? 0 : undefined}
                  >
                    {formatFileSize(file.size, 1)}
                  </Td>
                  <Td
                    isNumeric
                    borderBottom={hasError ? 'none' : undefined}
                    pb={hasError ? 0 : undefined}
                  >
                    <DeleteFile onClick={onDelete(key)} />
                  </Td>
                </Tr>
                {Array.isArray(error) && error[idx] && (
                  <Tr>
                    <Td colSpan={3} pt={0}>
                      <FormErrorMessage as='span' mt='unset'>
                        {error[idx].message}
                      </FormErrorMessage>
                    </Td>
                  </Tr>
                )}
              </Fragment>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export { SelectedFileList };
