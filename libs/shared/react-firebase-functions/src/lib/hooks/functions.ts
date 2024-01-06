import { useContext } from 'react';
import { FirebaseFunctionsContext } from '../FirebaseFunctionsProvider';

export const useFirebaseFunctions = () => useContext(FirebaseFunctionsContext);
