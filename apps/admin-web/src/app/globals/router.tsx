import { AuthenticatedApp, LoginPage } from '@teaparty/react-firebase-auth';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import Calendar from '../calendar/Calendar';
import FunctionsPage from '../functions/FunctionsPage';
import TestPage from '../test/TestPage';
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
            element: <TestPage />,
          },
          {
            path: '/functions',
            element: <FunctionsPage />,
          },
          {
            path: 'calendar',
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
