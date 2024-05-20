import { MenuItem, Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';

import { OpenModalButton } from '~/modules/application/components';

import { Content } from './content';

type Props = {
  id?: string;
};

// If no id is provided than it's opened through menu,
// otherwise it's opened as edit in session
const StatModal = ({ id }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {id ? (
        <OpenModalButton onOpen={onOpen} />
      ) : (
        <MenuItem onClick={onOpen}>Descriptive Stats</MenuItem>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
        <ModalOverlay />
        <Content onClose={onClose} id={id} />
      </Modal>
    </>
  );
};

// eslint-disable-next-line import/no-default-export
export default StatModal;
