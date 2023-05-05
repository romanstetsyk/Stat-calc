import { useDisclosure, Button, Modal, ModalOverlay } from "@chakra-ui/react";
import { Content } from "./Content";

function StatModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>z statistics</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
        <ModalOverlay />
        <Content onClose={onClose} />
      </Modal>
    </>
  );
}

export { StatModal };
