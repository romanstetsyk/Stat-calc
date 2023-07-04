import { MenuItem, Modal, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Content } from "./Content";

export const StatModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <MenuItem pl={8} onClick={onOpen}>
        With Data
      </MenuItem>

      <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
        <ModalOverlay />
        <Content onClose={onClose} />
      </Modal>
    </>
  );
};
