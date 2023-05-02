import { useDisclosure, Button, Modal, ModalOverlay } from "@chakra-ui/react";
import DescriptiveModalContent from "./ModalCont";
import { ColumnValues } from "../../App";
// import ZModalContent from "./ZModalContent";

type IProps = {
  cols: ColumnValues;
};

function DescriptiveStatisticsModal({ cols }: IProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Descriptive Stats</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
        <ModalOverlay />
        <DescriptiveModalContent onClose={onClose} cols={cols} />
      </Modal>
    </>
  );
}

export default DescriptiveStatisticsModal;
