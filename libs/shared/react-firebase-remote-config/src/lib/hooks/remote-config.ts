import { useContext } from 'react';
import { FirebaseRemoteConfigContext } from '../FirebaseRemoteConfigProvider';

export const useFirebaseRemoteConfig = () =>
  useContext(FirebaseRemoteConfigContext);
