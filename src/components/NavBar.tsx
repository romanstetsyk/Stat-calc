import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Link,
  useColorModeValue,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RRDLink, useLocation } from "react-router-dom";

export const NavBar = () => {
  const location = useLocation();

  return (
    <Box as={"header"}>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                display={{ base: "flex", md: "none" }}
                as={IconButton}
                icon={
                  isOpen ? (
                    <CloseIcon w={3} h={3} />
                  ) : (
                    <HamburgerIcon w={5} h={5} />
                  )
                }
                variant={"ghost"}
                aria-label={"Toggle Navigation"}
              />
              <MenuList>
                {NAV_ITEMS.map(({ label, href }) => (
                  <MenuItem key={label} as={RRDLink} to={href}>
                    {label}
                  </MenuItem>
                ))}
              </MenuList>
            </>
          )}
        </Menu>

        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            fontWeight={"bold"}
            color={useColorModeValue("gray.800", "white")}
          >
            NextStat
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <Button
            as={RRDLink}
            fontSize={"sm"}
            fontWeight={400}
            variant={"link"}
            to={"#"}
          >
            Sign In
          </Button>
          {location.pathname !== "/app" && (
            <Button
              as={RRDLink}
              to="/app"
              display={{ base: "none", md: "inline-flex" }}
              fontSize={"sm"}
              fontWeight={600}
              colorScheme={"green"}
              bg={"green.400"}
              rounded={"full"}
              _hover={{
                bg: "green.500",
              }}
            >
              Open App
            </Button>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Link
            p={2}
            as={RRDLink}
            to={navItem.href ?? "#"}
            fontSize={"sm"}
            fontWeight={500}
            color={linkColor}
            _hover={{
              textDecoration: "none",
              color: linkHoverColor,
            }}
          >
            {navItem.label}
          </Link>
        </Box>
      ))}
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
];
