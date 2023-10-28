import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const NavBar = (): JSX.Element => {
  const location = useLocation();

  return (
    <Box as='header'>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH='60px'
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle='solid'
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align='center'
      >
        <Menu>
          {({ isOpen }): JSX.Element => (
            <>
              <MenuButton
                display={{ base: 'flex', md: 'none' }}
                as={IconButton}
                icon={
                  isOpen ? (
                    <CloseIcon w={3} h={3} />
                  ) : (
                    <HamburgerIcon w={5} h={5} />
                  )
                }
                variant='ghost'
                aria-label='Toggle Navigation'
              />
              <MenuList>
                {NAV_ITEMS.map(({ label, href }) => (
                  <MenuItem key={label} as={RouterLink} to={href}>
                    {label}
                  </MenuItem>
                ))}
              </MenuList>
            </>
          )}
        </Menu>

        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily='heading'
            fontWeight='bold'
            color={useColorModeValue('gray.800', 'white')}
          >
            NextStat
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify='flex-end'
          direction='row'
          spacing={6}
        >
          <Button
            as={RouterLink}
            fontSize='sm'
            fontWeight={400}
            variant='link'
            to='/sign-in'
          >
            Sign In
          </Button>
          {location.pathname !== '/app' && (
            <Button
              as={RouterLink}
              to='/app'
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize='sm'
              fontWeight={600}
              colorScheme='green'
              bg='green.400'
              rounded='full'
              _hover={{
                bg: 'green.500',
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

const DesktopNav = (): JSX.Element => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');

  return (
    <Stack direction='row' spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Link
            p={2}
            as={RouterLink}
            to={navItem.href ?? '#'}
            fontSize='sm'
            fontWeight={500}
            color={linkColor}
            _hover={{
              textDecoration: 'none',
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

type NavItem = {
  label: string;
  subLabel?: string;
  children?: NavItem[];
  href?: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About',
    href: '/about',
  },
];

export { NavBar };
