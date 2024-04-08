import { Button, Flex, Show, Stack, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { Logo } from '~/common/components';
import { APP_ROUTES } from '~/common/constants';
import { useCurrentUser } from '~/modules/auth/hooks';

import { DesktopNav, MobileNav, ProfileMenu } from './components';
import { DesktopNavLink } from './components/desktop-nav-link';

function Header(): JSX.Element {
  const location = useLocation();

  const { data: currentUser } = useCurrentUser();

  return (
    <Flex
      as='header'
      bg={useColorModeValue('brand.bg.secondary', 'gray.800')}
      color={useColorModeValue('brand.text.subtle', 'white')}
      minH={14}
      px={{ base: 4 }}
      borderBottom={1}
      borderStyle='solid'
      borderColor={useColorModeValue('brand.border.primary', 'gray.900')}
    >
      <Show below='md'>
        <MobileNav />
      </Show>

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
        {currentUser ? (
          <ProfileMenu name={currentUser.name} />
        ) : (
          <DesktopNavLink href={APP_ROUTES.SIGN_UP}>Sign Up</DesktopNavLink>
        )}

        {location.pathname !== APP_ROUTES.APP && (
          <Button
            as={RouterLink}
            to={APP_ROUTES.APP}
            fontSize='sm'
            fontWeight={600}
            bg='brand.accent'
            color='brand.text.button.primary'
            rounded='full'
            _hover={{
              bg: 'brand.accentHover',
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
