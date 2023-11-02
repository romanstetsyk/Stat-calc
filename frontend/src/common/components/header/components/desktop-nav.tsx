import { Flex, UnorderedList } from '@chakra-ui/react';

import { NAV_ITEMS } from '../nav-items';
import { DesktopNavItem } from './desktop-nav-item';

const DesktopNav = (): JSX.Element => {
  return (
    <Flex as='nav' display={{ base: 'none', md: 'flex' }}>
      <UnorderedList styleType='none' gap={4} display='flex'>
        {NAV_ITEMS.map((navItem) => (
          <DesktopNavItem key={navItem.label} {...navItem} />
        ))}
      </UnorderedList>
    </Flex>
  );
};

export { DesktopNav };
