import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useCallback } from 'react';

import { useSignOut } from '~/modules/auth/hooks';

const MyProfile = (): JSX.Element => {
  const { mutate: signOut } = useSignOut();

  const handleSignOut = useCallback((): void => {
    signOut();
  }, [signOut]);

  return (
    <Menu>
      {(): JSX.Element => (
        <>
          <MenuButton fontSize='sm' fontWeight={400}>
            Account
          </MenuButton>
          <MenuList>
            <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export { MyProfile };
