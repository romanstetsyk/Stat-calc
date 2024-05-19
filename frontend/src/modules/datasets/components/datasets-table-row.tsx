import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Flex, Input, Link, Td, Tr } from '@chakra-ui/react';
import type {
  DatasetDTO,
  DatasetRenameRequestDTO,
} from '@shared/build/esm/index';
import { renameSchema } from '@shared/build/esm/index';
import { useCallback } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';

import { IconButtonTooltip } from '~/common/components';
import { formatFileSize } from '~/common/helpers';

import { useEditable, useRenameDataset } from '../hooks';
import { DownloadDatasetBtn } from './download-dataset-btn';

type Props = {
  dataset: DatasetDTO;
  onDelete: (id: string) => () => void;
};

const DatasetsTableRow = ({ dataset, onDelete }: Props): JSX.Element => {
  const { id, filename, ext, size, updatedAt } = dataset;

  const { mutate: renameDataset } = useRenameDataset(id);

  const onFormSubmit: SubmitHandler<DatasetRenameRequestDTO> = useCallback(
    (data) => {
      if (filename !== data.filename) {
        renameDataset(data);
      }
    },
    [filename, renameDataset],
  );

  const {
    getEditButtonProps,
    getInputProps,
    getPreviewProps,
    getSubmitButtonProps,
    getCancelButtonProps,
    value,
    isEditing,
  } = useEditable<DatasetRenameRequestDTO>({
    fieldName: 'filename',
    defaultValue: filename,
    validationSchema: renameSchema,
    onFormSubmit,
    submitOnBlur: false,
  });

  const previewProps = getPreviewProps();
  delete previewProps.onFocus; // onFocus prevents link to open

  return (
    <Tr key={id}>
      <Td isTruncated width='100%' title={filename}>
        <Link
          as={RouterLink}
          to={{ pathname: id }}
          target='_blank'
          rel='noreferrer noopener'
          {...previewProps}
        >
          {value + ext}
        </Link>

        <Flex wrap='nowrap' alignItems='center'>
          <Input
            {...getInputProps()}
            maxHeight={8}
            minWidth={40}
            value={value}
          />
          {isEditing && (
            <>
              <IconButtonTooltip
                label='Confirm'
                icon={<CheckIcon />}
                {...getSubmitButtonProps()}
              />
              <IconButtonTooltip
                label='Cancel'
                icon={<CloseIcon />}
                {...getCancelButtonProps()}
              />
            </>
          )}
        </Flex>
      </Td>
      <Td fontSize='sm' isNumeric>
        {formatFileSize(size, 1)}
      </Td>
      <Td fontSize='sm' isNumeric>
        {new Date(updatedAt).toLocaleString()}
      </Td>
      <Td isNumeric>
        <IconButtonTooltip
          label='Rename'
          icon={<EditIcon />}
          {...getEditButtonProps()}
        />
        <DownloadDatasetBtn id={id} />
        <IconButtonTooltip
          label='Delete file'
          icon={<DeleteIcon />}
          onClick={onDelete(id)}
        />
      </Td>
    </Tr>
  );
};

export { DatasetsTableRow };
