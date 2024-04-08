import {
  Box,
  Center,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import type { SignUpRequestDTO } from '@shared/build/esm/index';
import { useCallback } from 'react';
import { Link as RouterLink, Navigate } from 'react-router-dom';

import { APP_ROUTES } from '~/common/constants';

import { SignUpForm } from '../forms';
import { useCurrentUser, useSignUp } from '../hooks';

const SignUpPage = (): JSX.Element => {
  const { data: currentUser } = useCurrentUser();

  const { isSuccess, mutate: signIn } = useSignUp();

  const onSubmit = useCallback(
    (data: SignUpRequestDTO): void => {
      signIn(data);
    },
    [signIn],
  );

  const bgColor = useColorModeValue('brand.bg.primary', 'gray.800');
  const boxBgColor = useColorModeValue('brand.bg.secondary', 'gray.700');

  if (currentUser) {
    return <Navigate to={APP_ROUTES.HOME} replace={true} />;
  }

  if (isSuccess) {
    return <Navigate to={APP_ROUTES.APP} replace={true} />;
  }

  return (
    <Center as='main' flexGrow={1} bg={bgColor}>
      <Stack spacing={8} mx='auto' maxW='md' w='100%' py={12} px={3}>
        <Heading fontSize='4xl'>Sign up</Heading>

        <Box rounded='lg' bg={boxBgColor} boxShadow='lg' p={8}>
          <SignUpForm onSubmit={onSubmit} />
          <Text align='center' mt={8}>
            Already a user?{' '}
            <Link
              as={RouterLink}
              to={APP_ROUTES.SIGN_IN}
              color='brand.link.primary'
            >
              Sign in
            </Link>
          </Text>
        </Box>
      </Stack>
    </Center>
  );
};

export { SignUpPage };
