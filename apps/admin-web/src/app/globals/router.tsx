import { Layout } from '@teaparty/shared-ui';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import Calendar from '../calendar/Calendar';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        path: '',
        element: <Calendar />,
      },
    ],
  },
]);
