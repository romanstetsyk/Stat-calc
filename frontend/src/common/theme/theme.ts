import { extendTheme } from '@chakra-ui/react';

import { config } from './config';
import { global } from './global';

const theme = extendTheme({
  config,
  styles: global,
});

export { theme };
