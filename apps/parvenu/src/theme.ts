import {
  defineStyle,
  defineStyleConfig,
  extendTheme,
  withDefaultColorScheme,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// const colors = {
//   brand: {
//     900: "#1a365d",
//     800: "#153e75",
//     700: "#2a69ac",
//   },
// };

const outline = defineStyle({
  border: '0px', // change the appearance of the border
  borderRadius: '50%', // remove the border radius
});

export const buttonTheme = defineStyleConfig({
  variants: { outline },
});

export const theme = extendTheme(
  {
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false,
    },
    components: {
      Button: buttonTheme,
      variants: {
        base: {},
      },
      defaultProps: {
        variant: 'base',
      },
    },
    styles: {
      global: (props: any) => ({
        body: {
          bg: mode('white', '#092327')(props),
        },
      }),
    },
  },
  withDefaultColorScheme({ colorScheme: 'purple' })
);
