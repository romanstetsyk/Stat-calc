import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
  Text,
} from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
import type { SignInRequestDTO } from '@shared/build/esm/index';
import { signInSchema } from '@shared/build/esm/index';

import { InputControlled } from '~/common/components';
import { useForm } from '~/common/hooks';

import { DEFAULT_SIGN_IN_PAYLOAD } from './default-values';

type Props = {
  onSubmit: (data: SignInRequestDTO) => void;
};

const SignInForm = ({ onSubmit }: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInRequestDTO>({
    defaultValues: DEFAULT_SIGN_IN_PAYLOAD,
    resolver: joiResolver(signInSchema),
  });

  return (
    <Stack as='form' onSubmit={handleSubmit(onSubmit)} spacing={4}>
      <FormControl isInvalid={Boolean(errors.email)} isRequired>
        <FormLabel>Email address</FormLabel>
        <InputControlled type='email' control={control} name='email' />
        {errors.email && (
          <FormErrorMessage>{errors.email.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={Boolean(errors.password)} isRequired>
        <FormLabel>Password</FormLabel>
        <InputControlled type='password' control={control} name='password' />
        {errors.password && (
          <FormErrorMessage as='span' overflowWrap='anywhere' maxWidth='100%'>
            {errors.password.message}
          </FormErrorMessage>
        )}
      </FormControl>
      <Stack spacing={8}>
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          align='start'
          justify='space-between'
        >
          <Checkbox>Remember me</Checkbox>
          <Text color='brand.link.primary'>Forgot password?</Text>
        </Stack>
        <Button
          type='submit'
          bg='brand.bg.button.primary'
          color='brand.text.button.primary'
          _hover={{
            bg: 'brand.bg.button.primaryHover',
          }}
        >
          Sign in
        </Button>
      </Stack>
    </Stack>
  );
};

export { SignInForm };
