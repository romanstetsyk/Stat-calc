import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { APP_ROUTES } from '~/common/constants';
import { useCurrentUser, useSignOut } from '~/modules/auth/hooks';

const ProfileMenu = (): JSX.Element | null => {
  const { mutate: signOut } = useSignOut();
  const { data: currentUser } = useCurrentUser();

  const handleSignOut = useCallback((): void => {
    signOut();
  }, [signOut]);

  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');

  if (!currentUser) {
    return null;
  }

  return (
    <Menu>
      {(): JSX.Element => (
        <>
          <MenuButton
            p={2}
            fontSize='sm'
            fontWeight={400}
            color={linkColor}
            _hover={{ color: linkHoverColor }}
            _expanded={{ color: linkHoverColor }}
          >
            {currentUser.name}
          </MenuButton>
          <MenuList>
            <MenuItem as={RouterLink} to={APP_ROUTES.DATASETS}>
              Datasets
            </MenuItem>
            <MenuItem as={RouterLink} to={APP_ROUTES.ACCOUNT}>
              Account
            </MenuItem>
            <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export { ProfileMenu };
