import { Button, Flex, Stack, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { Logo } from '~/common/components';
import { APP_ROUTES } from '~/common/constants';

import { DesktopNav, MobileNav } from './components';

function Header(): JSX.Element {
  const location = useLocation();

  return (
    <Flex
      as='header'
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.600', 'white')}
      minH={14}
      px={{ base: 4 }}
      borderBottom={1}
      borderStyle='solid'
      borderColor={useColorModeValue('gray.200', 'gray.900')}
    >
      <MobileNav />

      <Flex
        flex={{ base: 1 }}
        justify={{ base: 'center', md: 'start' }}
        gap={{ md: 4, lg: 16 }}
      >
        <Logo />

        <DesktopNav />
      </Flex>

      <Stack
        flex={{ base: 1, md: 0 }}
        justify='flex-end'
        alignItems='center'
        direction='row'
        spacing={6}
      >
        <Button
          as={RouterLink}
          to={APP_ROUTES.SIGN_UP}
          fontSize='sm'
          fontWeight={400}
          variant='link'
        >
          Sign Up
        </Button>

        <Button
          as={RouterLink}
          to={APP_ROUTES.SIGN_IN}
          fontSize='sm'
          fontWeight={400}
          variant='link'
        >
          Sign In
        </Button>

        {location.pathname !== APP_ROUTES.APP && (
          <Button
            as={RouterLink}
            to={APP_ROUTES.APP}
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
  );
}

export { Header };
