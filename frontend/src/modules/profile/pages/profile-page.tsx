import {
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import { PROFILE_ITEMS } from '../constants';

type Props = {
  selectedIndex: number;
};

const ProfilePage = ({ selectedIndex }: Props): JSX.Element => {
  return (
    <>
      <Tabs index={selectedIndex} isManual isLazy lazyBehavior='unmount'>
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
            <TabPanel key={tab.label}>{tab.tabContent}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
};

export { ProfilePage };
