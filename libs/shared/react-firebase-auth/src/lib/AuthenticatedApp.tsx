import { Center, Spinner, Text, VStack } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/auth';

export const AuthenticatedApp: FC<PropsWithChildren> = ({ children }) => {
  const { initiated, authenticated } = useAuth();

  if (!initiated) {
    return (
      <Center minH={'100vh'}>
        <VStack>
          <Spinner size={'xl'} color="blue.400" />
          <Text>Resuming last session...</Text>
        </VStack>
      </Center>
    );
  }
  if (authenticated) {
    return children;
  }
  return <Navigate to={'/signin'} replace />;
};

export default AuthenticatedApp;
