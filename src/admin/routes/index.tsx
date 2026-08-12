import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { PageSkeleton } from '@/components/common';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PublicRoute } from '@/routes/PublicRoute';

const Login = lazy(() =>
  import('@/pages/auth/Login').then((m) => ({ default: m.Login })),
);
const Dashboard = lazy(() =>
  import('@/pages/dashboard/Dashboard').then((m) => ({ default: m.Dashboard })),
);
const CustomerList = lazy(() =>
  import('@/pages/customers/CustomerList').then((m) => ({ default: m.CustomerList })),
);
const TrainerList = lazy(() =>
  import('@/pages/trainers/TrainerList').then((m) => ({ default: m.TrainerList })),
);
const BranchList = lazy(() =>
  import('@/pages/branches/BranchList').then((m) => ({ default: m.BranchList })),
);
const SubscriptionList = lazy(() =>
  import('@/pages/subscriptions/SubscriptionList').then((m) => ({
    default: m.SubscriptionList,
  })),
);
const SessionList = lazy(() =>
  import('@/pages/sessions/SessionList').then((m) => ({ default: m.SessionList })),
);
const EventList = lazy(() =>
  import('@/pages/events/EventList').then((m) => ({ default: m.EventList })),
);
const ReportsHome = lazy(() =>
  import('@/pages/reports/ReportsHome').then((m) => ({ default: m.ReportsHome })),
);
const NotificationsPage = lazy(() =>
  import('@/pages/notifications/NotificationsPage').then((m) => ({
    default: m.NotificationsPage,
  })),
);
const TransactionList = lazy(() =>
  import('@/pages/transactions/TransactionList').then((m) => ({
    default: m.TransactionList,
  })),
);
const CouponList = lazy(() =>
  import('@/pages/coupons/CouponList').then((m) => ({ default: m.CouponList })),
);
const AdminOffers = lazy(() => import('@/components/AdminOffers'));
const BookingReport = lazy(() =>
  import('@/pages/reports/BookingReport').then((m) => ({ default: m.BookingReport })),
);
const Settings = lazy(() =>
  import('@/pages/settings/Settings').then((m) => ({ default: m.Settings })),
);
const Profile = lazy(() =>
  import('@/pages/profile/Profile').then((m) => ({ default: m.Profile })),
);
const NotFound = lazy(() =>
  import('@/pages/errors/NotFound').then((m) => ({ default: m.NotFound })),
);
const Unauthorized = lazy(() =>
  import('@/pages/errors/Unauthorized').then((m) => ({ default: m.Unauthorized })),
);

const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<PageSkeleton variant="list" />}>{element}</Suspense>
);

export const AppRouter = () =>
  useRoutes([
    {
      element: <PublicRoute />,
      children: [{ path: '/login', element: withSuspense(<Login />) }],
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            { path: '/dashboard', element: withSuspense(<Dashboard />) },
            {
              element: <ProtectedRoute permission="customers" />,
              children: [{ path: '/customers', element: withSuspense(<CustomerList />) }],
            },
            {
              element: <ProtectedRoute permission="trainers" />,
              children: [{ path: '/trainers', element: withSuspense(<TrainerList />) }],
            },
            {
              element: <ProtectedRoute permission="branches" />,
              children: [{ path: '/branches', element: withSuspense(<BranchList />) }],
            },
            {
              element: <ProtectedRoute permission="subscriptions" />,
              children: [
                { path: '/subscriptions', element: withSuspense(<SubscriptionList />) },
              ],
            },
            {
              element: <ProtectedRoute permission="sessions" />,
              children: [{ path: '/sessions', element: withSuspense(<SessionList />) }],
            },
            {
              element: <ProtectedRoute permission="events" />,
              children: [{ path: '/events', element: withSuspense(<EventList />) }],
            },
            {
              element: <ProtectedRoute permission="reports" />,
              children: [
                { path: '/reports', element: withSuspense(<ReportsHome />) },
                { path: '/reports/:type', element: withSuspense(<BookingReport />) },
              ],
            },
            {
              element: <ProtectedRoute permission="transactions" />,
              children: [
                {
                  path: '/transactions',
                  element: withSuspense(<TransactionList />),
                },
              ],
            },
            {
              element: <ProtectedRoute permission="coupons" />,
              children: [
                {
                  path: '/coupons',
                  element: withSuspense(<CouponList />),
                },
              ],
            },
            {
              element: <ProtectedRoute permission="offers" />,
              children: [
                {
                  path: '/offers',
                  element: withSuspense(<AdminOffers />),
                },
              ],
            },
            {
              element: <ProtectedRoute permission="notifications" />,
              children: [
                {
                  path: '/notifications',
                  element: withSuspense(<NotificationsPage />),
                },
              ],
            },
            {
              element: <ProtectedRoute permission="settings" />,
              children: [{ path: '/settings', element: withSuspense(<Settings />) }],
            },
            {
              element: <ProtectedRoute permission="profile" />,
              children: [{ path: '/profile', element: withSuspense(<Profile />) }],
            },
            { path: '/unauthorized', element: withSuspense(<Unauthorized />) },
          ],
        },
      ],
    },
    { path: '/', element: <Navigate to="/dashboard" replace /> },
    { path: '*', element: withSuspense(<NotFound />) },
  ]);
