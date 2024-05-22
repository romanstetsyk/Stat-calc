import {
  Container,
  Progress,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { Suspense, useMemo } from 'react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';

import { PROFILE_ITEMS } from '../constants';

const ProfilePage = (): JSX.Element => {
  const location = useLocation();

  const index = useMemo(
    () =>
      PROFILE_ITEMS.findIndex((item) => {
        // match route with and without trailing slash
        const regex = new RegExp(`^${item.path}/?`);
        return regex.test(location.pathname);
      }),
    [location.pathname],
  );

  return (
    <Container maxWidth='3xl' mt={8}>
      <Tabs index={index} isManual isLazy lazyBehavior='unmount'>
        <TabList>
          {PROFILE_ITEMS.map((tab) => (
            <Tab key={tab.label} as={RouterLink} to={tab.path}>
              {tab.label}
            </Tab>
          ))}
        </TabList>

        <TabIndicator
          mt='-1.5px'
          height='2px'
          bg='blue.500'
          borderRadius='1px'
        />

        <TabPanels>
          {PROFILE_ITEMS.map((tab) => (
            <TabPanel key={tab.label} px={0}>
              <Suspense fallback={<Progress size='xs' isIndeterminate />}>
                <Outlet />
              </Suspense>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ProfilePage;
