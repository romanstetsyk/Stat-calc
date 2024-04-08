import {
  ListItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

import type { NavItem } from '../types';
import { DesktopNavLink } from './desktop-nav-link';
import { DesktopSubNav } from './desktop-sub-nav';

const DesktopNavItem = ({ label, subItems, href }: NavItem): JSX.Element => {
  const popoverContentBgColor = useColorModeValue(
    'brand.bg.secondary',
    'gray.800',
  );

  return subItems ? (
    <Popover isLazy trigger='hover' placement='bottom-start' gutter={0}>
      {(): JSX.Element => (
        <ListItem>
          <PopoverTrigger>
            <DesktopNavLink href={href}>{label}</DesktopNavLink>
          </PopoverTrigger>
          <PopoverContent
            border={0}
            boxShadow='xl'
            bg={popoverContentBgColor}
            rounded='xl'
            minW='sm'
          >
            <Stack p={4}>
              {subItems.map((subItem) => (
                <DesktopSubNav key={subItem.label} {...subItem} />
              ))}
            </Stack>
          </PopoverContent>
        </ListItem>
      )}
    </Popover>
  ) : (
    <ListItem>
      <DesktopNavLink href={href}>{label}</DesktopNavLink>
    </ListItem>
  );
};

export { DesktopNavItem };
