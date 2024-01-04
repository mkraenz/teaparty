import { useAuth } from '@teaparty/react-firebase-auth';
import { Layout } from '@teaparty/shared-ui';
import ErrorDisplay from './ErrorDisplay';

const ErrorPage = () => {
  const { authenticated } = useAuth();
  if (!authenticated) return <ErrorDisplay />;
  return (
    <Layout>
      <ErrorDisplay />
    </Layout>
  );
};

export default ErrorPage;
