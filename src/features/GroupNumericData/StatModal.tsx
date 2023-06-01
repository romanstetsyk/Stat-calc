import { useDisclosure, Modal, ModalOverlay, MenuItem } from "@chakra-ui/react";
import { Content } from "./Content";

export const StatModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <MenuItem onClick={onOpen}>Group Numeric Data</MenuItem>

      <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
        <ModalOverlay />
        <Content onClose={onClose} />
      </Modal>
    </>
  );
};
