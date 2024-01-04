import { useContext } from 'react';
import { FirebaseContext } from '../FirebaseProvider';

export const useFirebase = () => useContext(FirebaseContext);
