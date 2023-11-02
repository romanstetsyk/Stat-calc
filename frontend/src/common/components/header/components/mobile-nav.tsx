import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { IconButton, Menu, MenuButton, MenuList } from '@chakra-ui/react';

import { NAV_ITEMS } from '../nav-items';
import { MobileNavItem } from './mobile-nav-item';

const MobileNav = (): JSX.Element => {
  return (
    <Menu strategy='fixed'>
      {({ isOpen }): JSX.Element => (
        <>
          <MenuButton
            display={{ base: 'flex', md: 'none' }}
            alignSelf='center'
            as={IconButton}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant='ghost'
            aria-label='Toggle Navigation'
          />
          <MenuList>
            {NAV_ITEMS.map((item) => (
              <MobileNavItem key={item.label} {...item} />
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export { MobileNav };
