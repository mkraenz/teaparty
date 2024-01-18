import { Center, Grid, GridItem, Heading, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import LoginAppbar from './LoginAppbar';
import LoginForm from './LoginForm';
import { useAuth } from './hooks';

interface Props {}

export const LoginPage: FC<Props> = () => {
  const { authenticated } = useAuth();
  const { t } = useTranslation();

  if (authenticated) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <Grid
      templateAreas={{
        base: ` "nav"
                "main"`,
      }}
      gridTemplateRows={{ base: 'fit-content(20px) 1fr' }}
      gap="1"
      minH={'100vh'}
    >
      <GridItem area={'nav'}>
        <LoginAppbar />
      </GridItem>
      <GridItem area={'main'} padding={4}>
        <Center minH={'full'}>
          <VStack>
            <Heading mb={4}>{t('Next Door DIY')}</Heading>
            <LoginForm />
          </VStack>
        </Center>
      </GridItem>
    </Grid>
  );
};

export default LoginPage;
