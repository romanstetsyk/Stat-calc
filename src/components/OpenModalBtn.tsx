import { EditIcon } from "@chakra-ui/icons";
import { IconButton, Tooltip } from "@chakra-ui/react";

type Props = {
  onOpen: () => void;
};

export const OpenModalBtn = ({ onOpen }: Props) => {
  return (
    <Tooltip hasArrow label="Edit" placement="top" fontSize="xs">
      <IconButton
        onClick={onOpen}
        variant="ghost"
        size="sm"
        aria-label="Edit"
        icon={<EditIcon />}
      />
    </Tooltip>
  );
};
