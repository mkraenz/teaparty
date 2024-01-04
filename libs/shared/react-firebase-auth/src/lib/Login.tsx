import { Button, Heading, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { useAuth } from './hooks/auth';

interface Props {}

const Login: FC<Props> = () => {
  const { createAccount, error, loading, signIn, authenticated, signOut } =
    useAuth();
  const email = 'example';
  const password = 'example';
  const credentials = { email, password };
  return (
    <VStack>
      <Button onClick={() => createAccount(credentials)} isLoading={loading}>
        Create Account
      </Button>
      {authenticated ? (
        <Button onClick={() => signOut()} isLoading={loading}>
          Sign Out
        </Button>
      ) : (
        <Button onClick={() => signIn(credentials)} isLoading={loading}>
          Sign In
        </Button>
      )}
      {error && (
        <>
          <Heading>Error</Heading>
          <p>
            {error.name} {error.code} {error.message}
          </p>
        </>
      )}
      <Heading>Current user</Heading>
      {/* <pre style={{ textWrap: "wrap", maxWidth: "90vw" }}>
        {JSON.stringify(user?.toJSON() ?? "not logged in", null, 2)}
      </pre> */}
    </VStack>
  );
};

export default Login;
