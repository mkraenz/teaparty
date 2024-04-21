import { ChakraProvider } from '@chakra-ui/react';
import { FirebaseProvider } from '@teaparty/react-firebase';
import { AuthProvider } from '@teaparty/react-firebase-auth';
import { FirebaseDatabaseProvider } from '@teaparty/react-firebase-database';
import { FirebaseFunctionsProvider } from '@teaparty/react-firebase-functions';
import { theme } from '@teaparty/shared-ui';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFunctions } from 'firebase/functions';
import { getRemoteConfig } from 'firebase/remote-config';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { FirebaseRemoteConfigProvider } from '../../../../libs/shared/react-firebase-remote-config/src';
import createI18n from './globals/i18n';
import { router } from './globals/router';
import { store } from './globals/store';

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
  remoteConfig: getRemoteConfig(app),
};

const i18n = createI18n();

export function App() {
  return (
    <Provider store={store}>
      <FirebaseProvider {...fbProps}>
        <FirebaseRemoteConfigProvider>
          <AuthProvider>
            <FirebaseDatabaseProvider>
              <FirebaseFunctionsProvider>
                <ChakraProvider theme={theme}>
                  <I18nextProvider i18n={i18n} defaultNS={'translation'}>
                    <RouterProvider router={router} />
                  </I18nextProvider>
                </ChakraProvider>
              </FirebaseFunctionsProvider>
            </FirebaseDatabaseProvider>
          </AuthProvider>
        </FirebaseRemoteConfigProvider>
      </FirebaseProvider>
    </Provider>
  );
}

export default App;
