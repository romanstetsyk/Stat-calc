import { Text, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import { APP_ROUTES } from '~/common/constants';

const Logo = (): JSX.Element => {
  return (
    <Text
      display='flex'
      alignItems='center'
      as={RouterLink}
      to={APP_ROUTES.HOME}
      textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
      fontFamily='heading'
      fontWeight='bold'
      color={useColorModeValue('brand.text.primary', 'white')}
      p={2}
    >
      NextStat
    </Text>
  );
};

export { Logo };
