import { DownloadIcon } from '@chakra-ui/icons';
import { IconButton, Tooltip } from '@chakra-ui/react';
import type { MouseEventHandler } from 'react';

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const DownloadDatasetBtn = ({ onClick }: Props): JSX.Element => {
  return (
    <Tooltip hasArrow label='Download file' placement='top' fontSize='xs'>
      <IconButton
        variant='ghost'
        size='sm'
        aria-label='Download file'
        icon={<DownloadIcon />}
        onClick={onClick}
      />
    </Tooltip>
  );
};

export { DownloadDatasetBtn };
