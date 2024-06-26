import {
  Button,
  Container,
  Flex,
  Hide,
  Show,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
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
    <Container
      maxWidth='unset'
      borderBottom={1}
      borderStyle='solid'
      borderColor={useColorModeValue('brand.border.primary', 'gray.900')}
    >
      <Flex
        as='header'
        bg={useColorModeValue('brand.bg.secondary', 'gray.800')}
        color={useColorModeValue('brand.text.subtle', 'white')}
        minH={14}
        mx='auto'
      >
        <Flex flexGrow={1} justify='start' gap={{ md: 4, lg: 16 }}>
          <Hide above='md'>
            <MobileNav />
          </Hide>
          <Logo />
          <Show above='md'>
            <DesktopNav />
          </Show>
        </Flex>

        <Stack
          justify='flex-end'
          alignItems='center'
          direction='row'
          spacing={6}
        >
          {currentUser ? (
            <ProfileMenu name={currentUser.firstName} />
          ) : (
            <DesktopNavLink href={APP_ROUTES.SIGN_UP}>Sign Up</DesktopNavLink>
          )}

          {location.pathname !== APP_ROUTES.APP && (
            <Button
              as={RouterLink}
              to={APP_ROUTES.APP}
              fontSize='sm'
              colorScheme='buttonColorScheme'
              fontWeight={600}
              rounded='full'
            >
              Open App
            </Button>
          )}
        </Stack>
      </Flex>
    </Container>
  );
}

export { Header };
