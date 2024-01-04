import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';

// const colors = {
//   brand: {
//     900: "#1a365d",
//     800: "#153e75",
//     700: "#2a69ac",
//   },
// };

export const theme = extendTheme(
  {
    config: {
      initialColorMode: 'system',
      useSystemColorMode: true,
    },
    components: {
      Button: {
        baseStyle: {
          textTransform: 'capitalize',
        },
      },
      variants: {
        base: {},
      },
      defaultProps: {
        variant: 'base',
      },
      Tooltip: {
        baseStyle: {
          _firstLetter: { textTransform: 'capitalize' },
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: 'blue' })
);
