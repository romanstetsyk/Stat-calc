import { CloseButton, Tooltip } from "@chakra-ui/react";
import { useContext } from "react";
import { SessionContext } from "src/contexts/SessionContext";

type Props = {
  id: string;
};

export const RemoveBtn = ({ id }: Props) => {
  const { removeSessionItem } = useContext(SessionContext);

  return (
    <Tooltip
      hasArrow
      label="Remove from session"
      placement="top"
      fontSize={"xs"}
    >
      <CloseButton
        size="sm"
        p={4}
        // visibility={"hidden"}
        // _groupHover={{ visibility: "visible" }}
        onClick={() => removeSessionItem(id)}
      />
    </Tooltip>
  );
};
