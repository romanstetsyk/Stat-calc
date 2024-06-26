import type { ThemeOverride } from '@chakra-ui/react';
import { theme as baseTheme } from '@chakra-ui/react';

const lightTheme: ThemeOverride = {
  colors: {
    buttonColorScheme: baseTheme.colors.teal,
    progressColorScheme: baseTheme.colors.teal,

    brand: {
      link: {
        primary: baseTheme.colors.blue['400'],
      },
      text: {
        primary: baseTheme.colors.gray['800'],
        subtle: baseTheme.colors.gray['600'],
        button: {
          primary: baseTheme.colors.white,
        },
      },
      bg: {
        primary: baseTheme.colors.gray['50'],
        secondary: baseTheme.colors.white,
        button: {
          primary: baseTheme.colors.blue['400'],
          primaryHover: baseTheme.colors.blue['500'],
        },
      },
      border: {
        primary: baseTheme.colors.gray['200'],
      },

      accent: baseTheme.colors.teal['500'],
      accentHover: baseTheme.colors.teal['600'],
    },
  },
};

export { lightTheme };
