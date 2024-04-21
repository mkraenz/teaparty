import { Analytics } from 'firebase/analytics';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Database } from 'firebase/database';
import { Functions } from 'firebase/functions';
import { RemoteConfig } from 'firebase/remote-config';
import React, { FC, PropsWithChildren, createContext } from 'react';

type FirebaseState = {
  auth: Auth;
  db: Database;
  functions: Functions;
  remoteConfig: RemoteConfig;
};

const defaultFirebaseState: FirebaseState = {
  auth: {} as Auth,
  db: {} as Database,
  functions: {} as Functions,
  remoteConfig: {} as RemoteConfig,
};

export const FirebaseContext =
  createContext<FirebaseState>(defaultFirebaseState);

export const FirebaseProvider: FC<
  PropsWithChildren<{
    app: FirebaseApp;
    analytics: Analytics;
    db: Database;
    functions: Functions;
    auth: Auth;
    remoteConfig: RemoteConfig;
  }>
> = ({ children, db, functions, auth, remoteConfig }) => {
  return (
    <FirebaseContext.Provider value={{ auth, db, functions, remoteConfig }}>
      {children}
    </FirebaseContext.Provider>
  );
};
