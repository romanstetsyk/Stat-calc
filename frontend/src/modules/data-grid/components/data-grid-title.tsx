import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import type { HeadingProps } from '@chakra-ui/react';
import { Flex, Heading, Input } from '@chakra-ui/react';
import type { DatasetRenameRequestDTO } from '@shared/build/esm/index';
import { renameSchema } from '@shared/build/esm/index';

import { IconButtonTooltip } from '~/common/components';
import { useEditable } from '~/modules/datasets/hooks';

import { useGridData } from '../hooks';

type Props = HeadingProps;

const DataGridTitle = (props: Props): JSX.Element => {
  const { title, renameDataset } = useGridData();

  const {
    isEditing,
    getEditButtonProps,
    getInputProps,
    getPreviewProps,
    getSubmitButtonProps,
    getCancelButtonProps,
    value,
  } = useEditable<DatasetRenameRequestDTO>({
    fieldName: 'filename',
    defaultValue: title,
    validationSchema: renameSchema,
    onFormSubmit: (data) => {
      renameDataset(data.filename);
    },
    submitOnBlur: false,
    isPreviewFocusable: false,
  });

  return (
    <>
      <Heading {...getPreviewProps()} {...props}>
        {value}
      </Heading>

      <Flex wrap='nowrap' alignItems='center'>
        <Input {...getInputProps()} maxHeight={8} value={value} />
        {isEditing ? (
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
        ) : (
          <IconButtonTooltip
            label='Rename'
            icon={<EditIcon />}
            {...getEditButtonProps()}
          />
        )}
      </Flex>
    </>
  );
};

export { DataGridTitle };
