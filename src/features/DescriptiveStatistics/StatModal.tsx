import { MenuItem, Modal, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { OpenModalBtn } from "~/components/OpenModalBtn";
import { Content } from "./Content";

type Props = {
  id?: string;
};

// If no id is provided than it's opened through menu,
// otherwise it's opened as edit in session
export const StatModal = ({ id }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {id ? (
        <OpenModalBtn onOpen={onOpen} />
      ) : (
        <MenuItem onClick={onOpen}>Descriptive Stats</MenuItem>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
        <ModalOverlay />
        <Content onClose={onClose} id={id} />
      </Modal>
    </>
  );
};
