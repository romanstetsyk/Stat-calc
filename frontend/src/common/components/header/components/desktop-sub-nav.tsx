import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import type { NavItem } from '../types';

const DesktopSubNav = ({ label, href, subLabel }: NavItem): JSX.Element => {
  return (
    <Box
      role='group'
      display='block'
      p={2}
      rounded='md'
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
    >
      <Stack direction='row' align='center' as={RouterLink} to={href}>
        <Box>
          <Text
            transition='all .3s ease'
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize='sm'>{subLabel}</Text>
        </Box>
        <Flex
          transition='all .3s ease'
          transform='translateX(-10px)'
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify='flex-end'
          align='center'
          flex={1}
        >
          <Icon color='pink.400' w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

export { DesktopSubNav };
