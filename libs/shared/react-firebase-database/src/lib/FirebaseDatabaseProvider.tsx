import { useFirebase } from '@teaparty/react-firebase';
import {
  Database,
  endAt,
  get,
  limitToLast,
  orderByChild,
  push,
  query,
  ref,
  set,
  startAt,
} from 'firebase/database';
import { FC, PropsWithChildren, createContext, useMemo, useState } from 'react';
import { User } from './database.types';

type DatabaseState = {
  createUser: (user: WithoutAutogenProps<User>) => Promise<User>;
  listUsers: (args?: {
    limit?: number;
    startAtCreationDate?: string | null;
    /** end is exclusive */
    endAtCreationDate?: string | null;
  }) => Promise<User[]>;
  deleteUser: (id: string) => Promise<void>;
  error: null | Error;
  loading: boolean;
};

const throwMissingProviderError = () => {
  throw new Error(
    'You need to wrap your component in a FirebaseDatabaseProvider'
  );
};
const defaultDatabaseState: DatabaseState = {
  createUser: throwMissingProviderError,
  listUsers: throwMissingProviderError,
  deleteUser: throwMissingProviderError,
  error: null,
  loading: false,
};

export const FirebaseDatabaseContext =
  createContext<DatabaseState>(defaultDatabaseState);

type WithoutAutogenProps<T> = Omit<T, 'id' | 'createdAt'>;

const userRoot = '/users/';

type Deps = {
  db: Database;
  setLoading: (val: boolean) => void;
  setError: (error: Error | null) => void;
};

type InnerFn<T> = T extends (deps: Deps) => infer R ? R : never;
const injectDeps =
  (deps: Deps) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <Fn extends (deps: Deps) => (...args: any) => Promise<any>>(fn: Fn) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (async (...args: any) => {
      deps.setLoading(true);
      try {
        return await fn(deps)(...args);
      } catch (error) {
        if (error instanceof Error) deps.setError(error);
        else
          deps.setError(
            new Error(typeof error === 'string' ? error : JSON.stringify(error))
          );
      } finally {
        deps.setLoading(false);
      }
    }) as InnerFn<Fn>;

const createUser_ =
  ({ db }: Pick<Deps, 'db'>) =>
  async (user: WithoutAutogenProps<User>) => {
    const child = push(ref(db, userRoot));
    if (!child.key)
      throw new Error(
        'child.key is nil. Please make sure you create a proper id'
      );
    const userForSaving = {
      ...user,
      id: child.key,
      createdAt: new Date().toISOString(),
    };
    await set(child, userForSaving);
    return userForSaving;
  };

const listUsers_ =
  ({ db }: Pick<Deps, 'db'>): DatabaseState['listUsers'] =>
  /** starting at creation date with null as realtime db orders its data so that null comes first. https://firebase.google.com/docs/database/web/lists-of-data#orderbychild  */
  async ({ limit, startAtCreationDate, endAtCreationDate } = {}) => {
    const q = query(
      ref(db, userRoot),
      orderByChild('createdAt'),
      startAt(startAtCreationDate ?? null),
      endAt(endAtCreationDate ?? new Date().toISOString()),
      limitToLast(limit ?? 10) // newest-first
    );
    const snapshot = await get(q);
    if (snapshot.exists()) {
      const val = snapshot.val() as { [key: string]: User };
      const users = Object.values(val);
      return users;
    }
    return [] as User[];
  };

const deleteUser_ =
  ({ db }: Pick<Deps, 'db'>) =>
  async (id: string) => {
    await set(ref(db, `${userRoot}${id}`), null);
  };

export const FirebaseDatabaseProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { db } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const { createUser, listUsers, deleteUser } = useMemo(() => {
    const deps = { db, setLoading, setError };
    return {
      listUsers: injectDeps(deps)(listUsers_),
      createUser: injectDeps(deps)(createUser_),
      deleteUser: injectDeps(deps)(deleteUser_),
    };
  }, [db, setLoading]);
  return (
    <FirebaseDatabaseContext.Provider
      value={{ createUser, listUsers, deleteUser, error, loading }}
    >
      {children}
    </FirebaseDatabaseContext.Provider>
  );
};

export default FirebaseDatabaseProvider;
