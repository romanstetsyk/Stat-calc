import { MenuItem, Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';

import { OpenModalButton } from '~/modules/application/components';

import { Content } from './content';

type Props = {
  id?: string;
};

const StatModal = ({ id }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {id ? (
        <OpenModalButton onOpen={onOpen} />
      ) : (
        <MenuItem onClick={onOpen}>Frequency Distribution</MenuItem>
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
