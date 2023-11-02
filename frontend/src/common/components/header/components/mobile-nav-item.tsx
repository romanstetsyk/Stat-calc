import { MenuGroup, MenuItem } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import type { NavItem } from '../types';

const MobileNavItem = ({ subItems, label, href }: NavItem): JSX.Element => {
  return subItems ? (
    <MenuGroup title={label} fontWeight={600} color='gray.600'>
      {subItems.map(({ label, href }) => (
        <MenuItem
          as={RouterLink}
          key={label}
          width='auto'
          ml={4}
          py={2}
          borderLeft={1}
          borderStyle='solid'
          borderColor='gray.200'
          to={href}
        >
          {label}
        </MenuItem>
      ))}
    </MenuGroup>
  ) : (
    <MenuItem key={label} as={RouterLink} to={href} py={2}>
      {label}
    </MenuItem>
  );
};

export { MobileNavItem };
