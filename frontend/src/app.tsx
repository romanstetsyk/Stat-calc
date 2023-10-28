import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { SharedLayout } from '~/components/shared-layout';
import { SignUp } from '~/modules/auth/pages/sign-up';
import { About } from '~/pages/about';

const Application = lazy(() => import('~/pages/application'));
const Home = lazy(() => import('~/pages/home'));

const App = (): JSX.Element => {
  return (
    <Routes>
      <Route path='/' element={<SharedLayout />}>
        <Route index element={<Home />} />
        <Route path='/app' element={<Application />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignUp />} />
        <Route path='*' element={<div>not found</div>} />
      </Route>
    </Routes>
  );
};

export { App };
