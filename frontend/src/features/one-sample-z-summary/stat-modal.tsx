import { MenuItem, Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';

import { OpenModalBtn } from '~/components/open-modal-btn';

import { Content } from './content';

type Props = {
  id?: string;
};

const StatModal = ({ id }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {id ? (
        <OpenModalBtn onOpen={onOpen} />
      ) : (
        <MenuItem pl={8} onClick={onOpen}>
          With Summary
        </MenuItem>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
        <ModalOverlay />
        <Content onClose={onClose} id={id} />
      </Modal>
    </>
  );
};

export { StatModal };
