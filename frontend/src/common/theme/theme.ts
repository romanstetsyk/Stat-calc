import type { ThemeOverride } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';

import { config } from './config';
import { global } from './global';
import { lightTheme } from './light-theme';

const theme = extendTheme({
  config,
  styles: global,
  ...lightTheme,
} satisfies ThemeOverride);

export { theme };
