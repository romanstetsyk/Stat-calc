import {
  Flex,
  ListItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import type { NavItem } from '../types';
import { DesktopSubNav } from './desktop-sub-nav';

const DesktopNavItem = ({ label, subItems, href }: NavItem): JSX.Element => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return subItems ? (
    <Popover isLazy trigger='hover' placement='bottom-start' gutter={0}>
      {(): JSX.Element => (
        <ListItem>
          <PopoverTrigger>
            <Flex
              alignItems='center'
              height='100%'
              as={RouterLink}
              p={2}
              to={href ?? '#'}
              fontSize='sm'
              fontWeight={500}
              color={linkColor}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
              }}
            >
              {label}
            </Flex>
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
          </PopoverContent>{' '}
        </ListItem>
      )}
    </Popover>
  ) : (
    <ListItem>
      <Flex
        alignItems='center'
        height='100%'
        as={RouterLink}
        p={2}
        to={href ?? '#'}
        fontSize='sm'
        fontWeight={500}
        color={linkColor}
        _hover={{
          textDecoration: 'none',
          color: linkHoverColor,
        }}
      >
        {label}
      </Flex>
    </ListItem>
  );
};

export { DesktopNavItem };
