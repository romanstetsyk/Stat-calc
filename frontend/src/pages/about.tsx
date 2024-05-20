import { useCallback } from 'react';

import { SignOutForm } from '~/modules/auth/forms';
import { useCurrentUser, useSignOut } from '~/modules/auth/hooks';

const About = (): JSX.Element => {
  const { status, data: currentUser, isError: isErrorCur } = useCurrentUser();
  const { mutate: signOut } = useSignOut();

  const onSubmit = useCallback((): void => {
    signOut();
  }, [signOut]);

  if (status === 'pending') {
    return <span>LoadingCur...</span>;
  }

  if (isErrorCur) {
    return <span>error current user</span>;
  }

  // We can assume by this point that `isSuccess === true`
  return (
    <>
      <pre>{JSON.stringify(currentUser)}</pre>
      <SignOutForm onSubmit={onSubmit} />
    </>
  );
};

// eslint-disable-next-line import/no-default-export
export default About;
