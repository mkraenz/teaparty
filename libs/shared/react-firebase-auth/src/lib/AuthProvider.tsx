import { useFirebase } from '@teaparty/react-firebase';
import {
  User,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from 'react';

type Credentials = { email: string; password: string };
type AuthState = {
  user: User | null;
  createAccount: (credentials: Credentials) => Promise<void>;
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  initiated: boolean;
  error: null | (Error & { code?: string | number });
  authenticated: boolean;
};

const defaultAuthState: AuthState = {
  user: null,
  createAccount: async () => {},
  signIn: async () => {},
  loading: false,
  initiated: false,
  error: null,
  authenticated: false,
  signOut: async () => {},
};

export const AuthContext = createContext<AuthState>(defaultAuthState);

/** IMPORTANT: Use within a FirebaseProvider. */
export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const { auth } = useFirebase();
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState(auth.currentUser); // separate tracking of user to ensure we rerender on auth state changes
  const [loading, setLoading] = useState(false);
  const [initiated, setInitiated] = useState(false);
  useEffect(() => {
    // without this, auth.currentUser will be null on first render and thus users will always be logged out
    const waitForInitialAuthState = async () => {
      await auth.authStateReady();
      setInitiated(true);
    };
    void waitForInitialAuthState();
  }, [setLoading, auth]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((newUser) => {
      setUser(newUser);
    });
    return unsubscribe;
  }, [setLoading, auth]);

  const clearError = () => setError(null);
  const createAccount = async ({ email, password }: Credentials) => {
    try {
      setLoading(true);
      clearError();
      await createUserWithEmailAndPassword(auth, email, password);
      clearError();
    } catch (err) {
      const error = err as Error & { code?: string | number };
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      clearError();
      await firebaseSignOut(auth);
      clearError();
    } catch (err) {
      const error = err as Error & { code?: string | number };
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async ({ email, password }: Credentials) => {
    try {
      setLoading(true);
      clearError();
      await signInWithEmailAndPassword(auth, email, password);
      clearError();
    } catch (err) {
      const error = err as Error & { code?: string | number };
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated: Boolean(auth.currentUser),
        createAccount,
        signIn,
        error,
        loading,
        signOut,
        initiated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
