import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
import type { SignUpRequestDTO } from '@shared/build/esm/index';
import { signUpSchema } from '@shared/build/esm/index';

import { InputControlled } from '~/common/components';
import { useForm } from '~/common/hooks';

import { DEFAULT_SIGN_UP_PAYLOAD } from './default-values';

type Props = {
  onSubmit: (data: SignUpRequestDTO) => void;
};

const SignUpForm = ({ onSubmit }: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpRequestDTO>({
    defaultValues: DEFAULT_SIGN_UP_PAYLOAD,
    resolver: joiResolver(signUpSchema),
  });

  return (
    <Stack as='form' onSubmit={handleSubmit(onSubmit)} spacing={4}>
      <FormControl isInvalid={Boolean(errors.name)}>
        <FormLabel>Full name</FormLabel>
        <InputControlled type='text' control={control} name='name' />
        {errors.name && (
          <FormErrorMessage>{errors.name.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={Boolean(errors.email)}>
        <FormLabel>Email address</FormLabel>
        <InputControlled type='email' control={control} name='email' />
        {errors.email && (
          <FormErrorMessage>{errors.email.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={Boolean(errors.password)}>
        <FormLabel>Password</FormLabel>
        <InputControlled type='password' control={control} name='password' />
        {errors.password && (
          <FormErrorMessage as='span' overflowWrap='anywhere' maxWidth='100%'>
            {errors.password.message}
          </FormErrorMessage>
        )}
      </FormControl>

      <Button
        type='submit'
        bg='blue.400'
        color='white'
        _hover={{
          bg: 'blue.500',
        }}
        mt={6}
      >
        Sign up
      </Button>
    </Stack>
  );
};

export { SignUpForm };
