import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import type { SignInRequestDTO } from 'shared/build/esm/index';

import { InputField } from '~/components/stat-form';
import { storage } from '~/framework/storage';

import { useSignIn } from '../hooks';

const SignIn = (): JSX.Element => {
  const { isSuccess, data, mutate: signIn } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInRequestDTO>();

  const onSubmit = (data: SignInRequestDTO): void => {
    signIn(data);
  };

  if (isSuccess) {
    storage.set('token', data.accessToken);
    return <Navigate to='/app' replace={true} />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label='Email'
          name='email'
          register={register}
          error={errors.email}
        />

        <InputField
          label='Password'
          name='password'
          register={register}
          error={errors.password}
        />

        <Button type='submit'>Sign in</Button>
      </form>
    </>
  );
};

export { SignIn };
