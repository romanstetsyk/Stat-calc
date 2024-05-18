import { EditIcon } from '@chakra-ui/icons';

import { IconButtonTooltip } from '~/common/components';

type Props = {
  onOpen: () => void;
};

const OpenModalButton = ({ onOpen }: Props): JSX.Element => {
  return (
    <IconButtonTooltip label='Edit' icon={<EditIcon />} onClick={onOpen} />
  );
};

export { OpenModalButton };
