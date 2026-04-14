import ErrorBoundary from '@/components/common/ErrorBoundary';
import NotFoundView from '@/components/common/exceptions/NotFoundView';
import { TabBarLayout } from '@/components/common/layouts/TabBarLayout';
import { ROUTES } from '@/constants/routes';
import CheckUserType from '@/pages/CheckUserType';
import Games from '@/pages/Games';
import History from '@/pages/History';
import Login from '@/pages/Login';
import ManageMenuDetail from '@/pages/ManageMenuDetail';
import ManageWaiting from '@/pages/ManageWaiting';
import MenuBoard from '@/pages/MenuBoard';
import Order from '@/pages/Order';
import Ordering from '@/pages/Ordering';
import Store from '@/pages/Store';
import Waiting from '@/pages/Waiting';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom';
import LoveAlarm from '../pages/LoveAlarm';
import ManageMissionDetail from '../pages/ManageMissionDetail';
import ManageQr from '../pages/ManageQr';
import { authLoader } from './authLoader';

function ProtectedLayout() {
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
  {
    path: '/check/:encryptedParam?',
    element: <CheckUserType />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    id: 'root',
    element: <ProtectedLayout />,
    loader: authLoader,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <TabBarLayout />,
        children: [
          {
            path: ROUTES.MANAGE_WAITING,
            element: <ManageWaiting />,
          },
          {
            path: ROUTES.ORDER,
            element: <Order />,
          },
          {
            path: ROUTES.STORE,
            element: <Store />,
          },
          {
            path: ROUTES.HISTORY,
            element: <History />,
          },
        ],
      },
      {
        path: ROUTES.MANAGE_MENUS.DETAIL(':menuId'),
        element: <ManageMenuDetail />,
      },
      {
        path: ROUTES.MANAGE_MISSIONS.DETAIL(':missionId'),
        element: <ManageMissionDetail />,
      },
      {
        path: ROUTES.MANAGE_QR,
        element: <ManageQr />,
      },
    ],
  },

  {
    path: ROUTES.WAITING,
    element: <Waiting />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.MENU_BOARD,
    element: <MenuBoard />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.GAMES.DETAIL(':gameId'),
    element: <Games />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.ORDERING,
    element: <Ordering />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.LOVE_ALARM,
    element: <LoveAlarm />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/not-found',
    element: <NotFoundView />,
  },
  { path: '*', element: <NotFoundView /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
