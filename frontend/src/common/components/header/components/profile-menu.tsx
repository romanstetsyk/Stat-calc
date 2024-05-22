import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from '@chakra-ui/react';
import type { UserInfo } from '@shared/build/esm/index';
import { useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { APP_ROUTES } from '~/common/constants';
import { useSignOut } from '~/modules/auth/hooks';

type Props = {
  name: UserInfo['firstName'];
};

const ProfileMenu = ({ name }: Props): JSX.Element | null => {
  const { mutate: signOut } = useSignOut();

  const handleSignOut = useCallback((): void => {
    signOut();
  }, [signOut]);

  const linkColor = useColorModeValue('brand.text.subtle', 'gray.200');
  const linkHoverColor = useColorModeValue('brand.text.primary', 'white');

  return (
    <Menu>
      {(): JSX.Element => (
        <>
          <Button
            as={MenuButton}
            p={2}
            height='100%'
            variant='link'
            fontSize='sm'
            fontWeight={500}
            color={linkColor}
            _hover={{ color: linkHoverColor }}
            _expanded={{ color: linkHoverColor }}
          >
            {name}
          </Button>
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
