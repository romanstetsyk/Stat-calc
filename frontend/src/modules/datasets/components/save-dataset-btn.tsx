import { IconButton, Tooltip } from '@chakra-ui/react';
import { useCallback } from 'react';
import { RiSave3Fill } from 'react-icons/ri';

import { useGridData } from '~/modules/data-grid/hooks';

import { createDatasetFile } from '../helpers';
import { useUpdateDataset } from '../hooks';

const SaveDatasetBtn = (): JSX.Element => {
  const { id, rowData, title, ext, recentEdits } = useGridData();
  const { mutate: updateDataset } = useUpdateDataset(id);

  const handleClick = useCallback((): void => {
    const filename = title + ext;
    const file = createDatasetFile(rowData, filename);
    if (file) {
      updateDataset(file);
    }
  }, [ext, rowData, title, updateDataset]);

  const isDisabled = !recentEdits.canUndo;

  return (
    <Tooltip hasArrow label='Save' placement='top' fontSize='xs'>
      <IconButton
        variant='ghost'
        size='sm'
        aria-label='Save'
        icon={<RiSave3Fill />}
        onClick={handleClick}
        isDisabled={isDisabled}
      />
    </Tooltip>
  );
};

export { SaveDatasetBtn };
