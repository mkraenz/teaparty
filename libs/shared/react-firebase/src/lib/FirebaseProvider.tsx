import { Analytics } from 'firebase/analytics';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Database } from 'firebase/database';
import { Functions } from 'firebase/functions';
import React, { FC, PropsWithChildren, createContext } from 'react';

type FirebaseState = {
  auth: Auth;
  db: Database;
  functions: Functions;
};

const defaultFirebaseState: FirebaseState = {
  auth: {} as Auth,
  db: {} as Database,
  functions: {} as Functions,
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
  }>
> = ({ children, db, functions, auth }) => {
  return (
    <FirebaseContext.Provider value={{ auth, db, functions }}>
      {children}
    </FirebaseContext.Provider>
  );
};
