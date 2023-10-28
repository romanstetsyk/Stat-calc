import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import type { SignUpRequestDTO } from 'shared/build/esm/index';

import { InputField } from '~/components/stat-form';
import { storage } from '~/framework/storage/storage';

import { signUp } from '../actions';

const SignUp = (): JSX.Element => {
  const signUpAction = signUp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpRequestDTO>();

  const onSubmit = (data: SignUpRequestDTO): void => {
    signUpAction.mutate(data);
  };

  // if (signUpAction.isError) {
  //   console.log(signUpAction.error.message);
  // }

  if (signUpAction.isSuccess) {
    // redirect to sign in
    storage.set('token', signUpAction.data.accessToken);
    return <Navigate to='/app' replace={true} />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label='Name'
          name='name'
          register={register}
          error={errors.name}
        />

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

        <Button type='submit'>Sign up</Button>
      </form>
    </>
  );
};

export { SignUp };
