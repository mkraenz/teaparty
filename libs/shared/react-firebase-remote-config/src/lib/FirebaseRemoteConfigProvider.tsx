import { useFirebase } from '@teaparty/react-firebase';
import { fetchAndActivate, getValue } from 'firebase/remote-config';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
} from 'react';
import defaultValues from './remote_config_defaults.json';

type FeatureFlag = typeof defaultValues;
type FeatureFlagKey = keyof FeatureFlag;
type BooleanFeatureFlagKey = keyof {
  [key in FeatureFlagKey as FeatureFlag[key] extends boolean
    ? key
    : never]: FeatureFlag[key];
};
type StringFeatureFlagKey = keyof {
  [key in FeatureFlagKey as FeatureFlag[key] extends string
    ? key
    : never]: FeatureFlag[key];
};
type NumberFeatureFlagKey = keyof {
  [key in FeatureFlagKey as FeatureFlag[key] extends number
    ? key
    : never]: FeatureFlag[key];
};

const MINIMUM_FETCH_INTERVAL_IN_MS = 1000 * 60;
export type FirebaseRemoteConfigState = {
  getFeatureFlagAsBoolean: (flagName: BooleanFeatureFlagKey) => boolean;
  getFeatureFlagAsString: (flagName: StringFeatureFlagKey) => string;
  getFeatureFlagAsNumber: (flagName: NumberFeatureFlagKey) => number;
};

const throwDefaultError = () => {
  throw new Error('default state. Did you wrap your component in a provider?');
};
const defaultState: FirebaseRemoteConfigState = {
  getFeatureFlagAsBoolean: throwDefaultError,
  getFeatureFlagAsString: throwDefaultError,
  getFeatureFlagAsNumber: throwDefaultError,
};

export const FirebaseRemoteConfigContext =
  createContext<FirebaseRemoteConfigState>(defaultState);

export const FirebaseRemoteConfigProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { remoteConfig } = useFirebase();
  useEffect(() => {
    remoteConfig.settings.minimumFetchIntervalMillis =
      MINIMUM_FETCH_INTERVAL_IN_MS;
    // TODO the default config is not 100% identical to what we download from firebase. Instead, we turn it into the correct format (e.g. when firebase exports a boolean as a string 'true', we change it into the boolean `true` inside the JSON). BAAAAD and error-prone.
    remoteConfig.defaultConfig = defaultValues;
    // HERE THE ACTUAL ACTION!
    fetchAndActivate(remoteConfig).catch(console.error);
  }, [remoteConfig]);

  const getFeatureFlagAsBoolean = useCallback(
    (key: FeatureFlagKey) => getValue(remoteConfig, key).asBoolean(),
    [remoteConfig]
  );
  const getFeatureFlagAsString = useCallback(
    (key: FeatureFlagKey) => getValue(remoteConfig, key).asString(),
    [remoteConfig]
  );
  const getFeatureFlagAsNumber = useCallback(
    (key: FeatureFlagKey) => getValue(remoteConfig, key).asNumber(),
    [remoteConfig]
  );
  return (
    <FirebaseRemoteConfigContext.Provider
      value={{
        getFeatureFlagAsBoolean,
        getFeatureFlagAsString,
        getFeatureFlagAsNumber,
      }}
    >
      {children}
    </FirebaseRemoteConfigContext.Provider>
  );
};

export default FirebaseRemoteConfigProvider;
