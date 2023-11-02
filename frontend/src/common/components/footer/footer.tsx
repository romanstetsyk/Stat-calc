import { Flex, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

import { Logo, SocialButton } from '~/common/components';

const Footer = (): JSX.Element => {
  return (
    <Flex
      as='footer'
      minW='100%'
      py={2}
      direction={{ base: 'column', md: 'row' }}
      justifyContent={{ base: 'center', md: 'space-between' }}
      alignItems={{ base: 'center', md: 'center' }}
      gap={4}
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt='auto'
      px={{ base: 4 }}
    >
      <Logo />
      <Text fontSize='sm'>
        © {new Date().getFullYear()}. All rights reserved
      </Text>
      <Stack direction='row' spacing={6}>
        <SocialButton label='GitHub' href='#'>
          <FaGithub />
        </SocialButton>
      </Stack>
    </Flex>
  );
};

export { Footer };
