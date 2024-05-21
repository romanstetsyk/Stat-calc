import { Flex, UnorderedList } from '@chakra-ui/react';

import { NAV_ITEMS } from '../nav-items';
import { DesktopNavItem } from './desktop-nav-item';

const DesktopNav = (): JSX.Element | null => {
  if (NAV_ITEMS.length === 0) {
    return null;
  }
  return (
    <Flex as='nav'>
      <UnorderedList styleType='none' gap={4} display='flex'>
        {NAV_ITEMS.map((navItem) => (
          <DesktopNavItem key={navItem.label} {...navItem} />
        ))}
      </UnorderedList>
    </Flex>
  );
};

export { DesktopNav };
