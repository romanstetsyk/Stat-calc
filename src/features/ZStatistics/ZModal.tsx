import { useDisclosure, Button, Modal, ModalOverlay } from "@chakra-ui/react";
import ZModalContent from "./ZModalContent";

function ZModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>z statistics</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={'2xl'}>
        <ModalOverlay />
        <ZModalContent onClose={onClose} />
      </Modal>
    </>
  );
}

export default ZModal;
