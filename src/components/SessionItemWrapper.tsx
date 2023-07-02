import {
  Card,
  CardHeader,
  CloseButton,
  Flex,
  Heading,
  Tooltip,
} from "@chakra-ui/react";
import { useContext } from "react";
import { SessionContext } from "src/contexts/SessionContext";

type Props = {
  children: React.ReactNode;
  outputId: string;
  title: string;
};

export const SessionItemWrapper = ({ outputId, title, children }: Props) => {
  const { removeSessionItem } = useContext(SessionContext);

  return (
    <Card
      mx={2}
      my={1}
      data-group
      cursor={"auto"}
      boxShadow="xs"
      transitionDuration="200ms"
      transitionProperty="boxShadow"
      _hover={{
        boxShadow: "var(--chakra-shadows-base), var(--chakra-shadows-xs)",
      }}
    >
      <Flex alignItems={"flex-start"}>
        <CardHeader className="draggableHeader" flexGrow={1} p={3}>
          <Heading as="h4" size="sm" whiteSpace={"nowrap"}>
            {title}
          </Heading>
          {/* <Text fontSize="md">
            {new Date(timestamp).toLocaleString()}
          </Text> */}
        </CardHeader>
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
            _groupHover={{ visibility: "visible" }}
            onClick={() => removeSessionItem(outputId)}
          />
        </Tooltip>
      </Flex>
      {children}
    </Card>
  );
};
