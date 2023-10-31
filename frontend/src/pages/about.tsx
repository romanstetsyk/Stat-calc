import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { useCurrentUser, useSignOut } from '~/modules/auth/hooks';

const About = (): JSX.Element => {
  const { status, data: currentUser, isError: isErrorCur } = useCurrentUser();
  const signOut = useSignOut();

  const navigate = useNavigate();

  const handleSignOut = async (): Promise<void> => {
    const { isSuccess } = await signOut.refetch();
    if (isSuccess) {
      signOut.invalidateCurrentUser();
      navigate('/sign-in');
    }
  };

  if (status === 'loading') {
    return <span>LoadingCur...</span>;
  }

  if (isErrorCur) {
    return <span>error current user</span>;
  }

  // We can assume by this point that `isSuccess === true`
  return (
    <>
      <pre>{JSON.stringify(currentUser)}</pre>
      {currentUser && (
        <Button type='button' onClick={handleSignOut} width={150}>
          Sign Out
        </Button>
      )}
    </>
  );
};

export { About };
