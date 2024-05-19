import { useCallback } from 'react';
import { RiSave3Fill } from 'react-icons/ri';

import { IconButtonTooltip } from '~/common/components';
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
      recentEdits.save();
    }
  }, [ext, recentEdits, rowData, title, updateDataset]);

  const isDisabled = recentEdits.isSaved || rowData.isEmpty();

  return (
    <IconButtonTooltip
      label='Save'
      icon={<RiSave3Fill />}
      onClick={handleClick}
      isDisabled={isDisabled}
    />
  );
};

export { SaveDatasetBtn };
