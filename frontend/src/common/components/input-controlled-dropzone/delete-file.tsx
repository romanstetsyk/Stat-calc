import { DeleteIcon } from '@chakra-ui/icons';
import { IconButton, Tooltip } from '@chakra-ui/react';
import type { MouseEventHandler } from 'react';

type Props = {
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const DeleteFile = ({ onClick }: Props): JSX.Element => {
  return (
    <Tooltip hasArrow label='Delete file' placement='top' fontSize='xs'>
      <IconButton
        variant='ghost'
        size='sm'
        aria-label='Delete file'
        icon={<DeleteIcon />}
        onClick={onClick}
      />
    </Tooltip>
  );
};

export { DeleteFile };
