import { useDisclosure, Button, Modal, ModalOverlay } from "@chakra-ui/react";
import { Content } from "./Content";
import { ColumnValues } from "../../Types";

type Props = {
  cols: ColumnValues;
};

export const StatModal = ({ cols }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Descriptive Stats</Button>

      <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
        <ModalOverlay />
        <Content onClose={onClose} cols={cols} />
      </Modal>
    </>
  );
};
