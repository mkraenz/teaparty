import { ChakraProvider } from '@chakra-ui/react';
import { FirebaseProvider } from '@teaparty/react-firebase';
import { AuthProvider } from '@teaparty/react-firebase-auth';
import { theme } from '@teaparty/shared-ui';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFunctions } from 'firebase/functions';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import createI18n from './globals/i18n';
import { router } from './globals/router';

const firebaseConfig: FirebaseOptions = JSON.parse(
  import.meta.env.VITE_FIREBASE_CONFIG
);

const app = initializeApp(firebaseConfig);
// we want to initialize analytics before any react code in case an error happens.
const analytics =
  import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
    ? getAnalytics(app)
    : ({} as Analytics);
const fbProps = {
  analytics,
  app,
  auth: getAuth(app),
  db: getDatabase(app),
  functions: getFunctions(app, 'europe-west1'),
};

const i18n = createI18n();

export function App() {
  return (
    <FirebaseProvider {...fbProps}>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <I18nextProvider i18n={i18n} defaultNS={'translation'}>
            <RouterProvider router={router} />
          </I18nextProvider>
        </ChakraProvider>
      </AuthProvider>
    </FirebaseProvider>
  );
}

export default App;
