import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@teaparty/shared-ui';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import createI18n from './globals/i18n';
import { router } from './globals/router';

const i18n = createI18n();

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <I18nextProvider i18n={i18n} defaultNS={'translation'}>
        <RouterProvider router={router} />
      </I18nextProvider>
    </ChakraProvider>
  );
}

export default App;
