import { ReactNode } from "react";
import { Link as RRDLink } from "react-router-dom";
import {
  Box,
  Container,
  Flex,
  Stack,
  Text,
  VisuallyHidden,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const Logo = () => {
  return (
    <Text
      fontFamily={"heading"}
      fontWeight={"bold"}
      color={useColorModeValue("gray.800", "white")}
    >
      NextStat
    </Text>
  );
};

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={RRDLink}
      to={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function SmallWithLogoLeft() {
  return (
    <Box
      as={"footer"}
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      mt={"36"}
    >
      <Container
        as={Flex}
        minW={"100%"}
        py={4}
        direction={{ base: "column", md: "row" }}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
        gap={4}
      >
        <Logo />
        <Text>© {new Date().getFullYear()}. All rights reserved</Text>
        <Stack direction={"row"} spacing={6}>
          <SocialButton label={"GitHub"} href={"#"}>
            <FaGithub />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}
