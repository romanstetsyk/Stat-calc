import { useDisclosure, Button, Modal, ModalOverlay } from "@chakra-ui/react";
import { Content } from "./Content";

export const StatModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>z2 statistics</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
        <ModalOverlay />
        <Content onClose={onClose} />
      </Modal>
    </>
  );
};
