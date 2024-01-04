import { AuthenticatedApp, LoginPage } from '@teaparty/react-firebase-auth';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import Calendar from '../calendar/Calendar';
import ErrorPage from './components/ErrorPage';
import LayoutWrapper from './components/LayoutWrapper';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LayoutWrapper>
        <Outlet />
      </LayoutWrapper>
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
