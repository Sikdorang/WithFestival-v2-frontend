import ErrorBoundary from '@/components/common/ErrorBoundary';
import NotFoundView from '@/components/common/exceptions/NotFoundView';
import { TabBarLayout } from '@/components/common/layouts/TabBarLayout';
import { ROUTES } from '@/constants/routes';
import History from '@/pages/admin/History';
import ManageMenuDetail from '@/pages/admin/ManageMenuDetail';
import ManageMissionDetail from '@/pages/admin/ManageMissionDetail';
import ManageQr from '@/pages/admin/ManageQr';
import ManageReserve from '@/pages/admin/ManageReserve';
import ManageReserveDetail from '@/pages/admin/ManageReserveDetail';
import ManageWaiting from '@/pages/admin/ManageWaiting';
import Order from '@/pages/admin/Order';
import Store from '@/pages/admin/Store';
import CheckUserType from '@/pages/auth/CheckUserType';
import Login from '@/pages/auth/Login';
import BoothMap from '@/pages/client/BoothMap';
import BoothPortal from '@/pages/client/BoothPortal';
import Games from '@/pages/client/Games';
import LoveAlarm from '@/pages/client/LoveAlarm';
import MenuBoard from '@/pages/client/MenuBoard';
import Ordering from '@/pages/client/Ordering';
import Reserve from '@/pages/client/Reserve';
import Waiting from '@/pages/client/Waiting';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom';
import AiMenuGenerator from '../pages/admin/AiMenuGenerator';
import ManageMission from '../pages/admin/ManageMission';
import ManageWaitingSetting from '../pages/admin/ManageWaitingSetting';
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
    path: ROUTES.LINKS,
    element: <BoothPortal />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.RESERVATION,
    element: <Reserve />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.MAP,
    element: <BoothMap />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.MANAGE_RESERVE.ROOT,
    element: <ManageReserve />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.MANAGE_RESERVE.DETAIL_PATH,
    element: <ManageReserveDetail />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.AI_MENU_GENERATOR,
    element: <AiMenuGenerator />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.MANAGE_WAITING_SETTING,
    element: <ManageWaitingSetting />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: ROUTES.MANAGE_MISSIONS.ROOT,
    element: <ManageMission />,
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
