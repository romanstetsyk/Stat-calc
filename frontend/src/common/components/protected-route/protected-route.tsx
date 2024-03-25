import { Navigate } from 'react-router-dom';

import { APP_ROUTES } from '~/common/constants';
import { useCurrentUser } from '~/modules/auth/hooks';

type Props = {
  children: React.ReactElement;
};

const ProtectedRoute = ({ children }: Props): JSX.Element => {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) {
    return <Navigate to={APP_ROUTES.SIGN_IN} replace={true} />;
  }

  return children;
};

export { ProtectedRoute };
