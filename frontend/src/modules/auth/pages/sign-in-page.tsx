import {
  Box,
  Center,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import type { SignInRequestDTO } from '@shared/build/esm/index';
import { useCallback } from 'react';
import { Link as RouterLink, Navigate } from 'react-router-dom';

import { APP_ROUTES } from '~/common/constants';

import { SignInForm } from '../forms';
import { useCurrentUser, useSignIn } from '../hooks';

const SignInPage = (): JSX.Element => {
  const { data: currentUser } = useCurrentUser();

  const { isSuccess, mutate: signIn } = useSignIn();

  const onSubmit = useCallback(
    (data: SignInRequestDTO): void => {
      signIn(data);
    },
    [signIn],
  );

  const bgColor = useColorModeValue('brand.bg.primary', 'gray.800');
  const boxBgColor = useColorModeValue('brand.bg.secondary', 'gray.700');

  if (isSuccess) {
    return <Navigate to={APP_ROUTES.APP} replace={true} />;
  }

  if (currentUser) {
    return <Navigate to={APP_ROUTES.HOME} replace={true} />;
  }

  return (
    <Center as='main' flexGrow={1} bg={bgColor}>
      <Stack spacing={8} mx='auto' maxW='md' w='100%' py={12} px={3}>
        <Heading fontSize='4xl'>Sign in to your account</Heading>

        <Box rounded='lg' bg={boxBgColor} boxShadow='lg' p={8}>
          <SignInForm onSubmit={onSubmit} />
          <Text align='center' mt={8}>
            Not registered yet?{' '}
            <Link
              as={RouterLink}
              to={APP_ROUTES.SIGN_UP}
              color='brand.link.primary'
            >
              Sign up
            </Link>
          </Text>
        </Box>
      </Stack>
    </Center>
  );
};

export { SignInPage };
