import { Button, Stack } from '@chakra-ui/react';

import { useForm } from '~/common/hooks';

type Props = {
  onSubmit: () => void;
};

const SignOutForm = ({ onSubmit }: Props): JSX.Element => {
  const { handleSubmit } = useForm();

  return (
    <Stack as='form' onSubmit={handleSubmit(onSubmit)} spacing={4}>
      <Button type='submit' width={150}>
        Sign out
      </Button>
    </Stack>
  );
};

export { SignOutForm };
