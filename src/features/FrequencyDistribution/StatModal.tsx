import { MenuItem, Modal, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { OpenModalBtn } from "~/components/OpenModalBtn";
import { Content } from "./Content";

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
