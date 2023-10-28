import { getCurrentUser } from '~/modules/auth/actions';

const About = (): JSX.Element => {
  const {
    status: statusCur,
    data: dataCur,
    isError: isErrorCur,
  } = getCurrentUser();

  if (statusCur === 'loading') {
    return <span>LoadingCur...</span>;
  }

  if (isErrorCur) {
    return <span>error current user</span>;
  }

  // We can assume by this point that `isSuccess === true`
  return (
    <>
      <div>{dataCur.email}</div>
    </>
  );
};

export { About };
