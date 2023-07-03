import { useDisclosure, Modal, ModalOverlay, MenuItem } from "@chakra-ui/react";
import { Content } from "./Content";
import { OpenModalBtn } from "src/components/OpenModalBtn";

type Props = {
  id?: string;
};

export const StatModal = ({ id }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {id ? (
        <OpenModalBtn onOpen={onOpen} />
      ) : (
        <MenuItem onClick={onOpen}>Frequency Distribution</MenuItem>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
        <ModalOverlay />
        <Content onClose={onClose} id={id} />
      </Modal>
    </>
  );
};
