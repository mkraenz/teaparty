import { AuthenticatedApp, LoginPage } from '@teaparty/react-firebase-auth';
import { Layout } from '@teaparty/shared-ui';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import Calendar from '../calendar/Calendar';
import ErrorPage from './components/ErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: (
          <AuthenticatedApp>
            <Outlet />
          </AuthenticatedApp>
        ),
        children: [
          {
            path: '',
            element: <Calendar />,
          },
        ],
      },
    ],
  },
  {
    path: '/signin',
    element: <LoginPage />,
  },
]);
