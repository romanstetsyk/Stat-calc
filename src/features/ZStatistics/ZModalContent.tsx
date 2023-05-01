import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import ZForm from "./ZForm";

interface IProps {
  onClose: () => void;
}

function ZModalContent({ onClose }: IProps) {
  return (
    <ModalContent>
      <ModalHeader>One Sample Z Test with Summary</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <ZForm />
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={onClose}>
          Close
        </Button>
        <Button variant="ghost">Secondary Action</Button>
      </ModalFooter>
    </ModalContent>
  );
}

export default ZModalContent;
