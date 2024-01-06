import { useFirebase } from '@teaparty/react-firebase';
import { httpsCallable } from 'firebase/functions';
import { FC, PropsWithChildren, createContext, useCallback } from 'react';

export type FirebaseFunctionsState = {
  createSubscription: ReturnType<
    typeof httpsCallable<never, { success: true }>
  >;
};

const defaultState: FirebaseFunctionsState = {
  createSubscription: () => {
    throw new Error(
      'default state. Did you wrap your component in a provider?'
    );
  },
};

export const FirebaseFunctionsContext =
  createContext<FirebaseFunctionsState>(defaultState);

export const FirebaseFunctionsProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { functions } = useFirebase();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- not a useful suggestion by react-hooks/exhaustive-deps to pass an array function
  const createSubscription = useCallback(
    httpsCallable<never, { success: true }>(functions, 'createSubscription'),
    [functions]
  );
  return (
    <FirebaseFunctionsContext.Provider value={{ createSubscription }}>
      {children}
    </FirebaseFunctionsContext.Provider>
  );
};

export default FirebaseFunctionsProvider;
