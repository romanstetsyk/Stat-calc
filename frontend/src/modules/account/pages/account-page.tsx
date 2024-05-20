import { Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react';

import { useCurrentUser } from '~/modules/auth/hooks';

const AccountPage = (): JSX.Element | null => {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) {
    return null;
  }
  return (
    <TableContainer>
      <Table variant='simple'>
        <Tbody>
          <Tr>
            <Td>Name</Td>
            <Td>{currentUser.name}</Td>
          </Tr>
          <Tr>
            <Td>Email</Td>
            <Td>{currentUser.email}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

// eslint-disable-next-line import/no-default-export
export default AccountPage;
