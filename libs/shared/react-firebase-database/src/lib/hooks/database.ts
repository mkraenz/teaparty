import { useContext } from 'react';
import { FirebaseDatabaseContext } from '../FirebaseDatabaseProvider';

export const useDb = () => useContext(FirebaseDatabaseContext);
