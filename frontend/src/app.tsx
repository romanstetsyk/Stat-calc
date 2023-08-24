import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { SharedLayout } from '~/components/shared-layout';

const Application = lazy(() => import('~/pages/application'));
const Home = lazy(() => import('~/pages/home'));

const App = (): JSX.Element => {
  return (
    <Routes>
      <Route path='/' element={<SharedLayout />}>
        <Route index element={<Home />} />
        <Route path='/app' element={<Application />} />
        <Route path='/about' element={<div>/about</div>} />
        <Route path='*' element={<div>not found</div>} />
      </Route>
    </Routes>
  );
};

export { App };
