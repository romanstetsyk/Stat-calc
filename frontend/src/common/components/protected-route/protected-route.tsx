import { Progress } from '@chakra-ui/react';
import { Navigate } from 'react-router-dom';

import { APP_ROUTES } from '~/common/constants';
import { useCurrentUser } from '~/modules/auth/hooks';

type Props = {
  children: React.ReactElement;
};

const ProtectedRoute = ({ children }: Props): JSX.Element => {
  const { data: currentUser, isSuccess, isFetching } = useCurrentUser();

  if (isFetching) {
    return <Progress size='xs' isIndeterminate />;
  }

  if (isSuccess && currentUser) {
    return children;
  }

  return <Navigate to={APP_ROUTES.SIGN_IN} replace={true} />;
};

export { ProtectedRoute };
