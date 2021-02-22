import React, { Fragment } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
// import MainLayout from 'layouts/MainLayout';

import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import NotFoundPage from './components/NotFoundPage';
import AdminUsersPage from './components/AdminUsersPage';
import AdminGroupsPage from './components/AdminGroupsPage';
import UserDashboardPage from './components/UserDashboardPage';
import UserSettingsPage from './components/UserSettingsPage';
import UserMethodsPage from './components/UserMethodsPage';

import AuthGuard from './components/AuthGuard';
import GuestGuard from './components/GuestGuard';

export const renderRoutes = (routes = []) => (
  <Switch>
    {routes.map((route, i) => {
      const Guard = route.guard || Fragment;
      const Layout = route.layout || Fragment;
      const Component = route.component;

      return (
        <Route
          key={i}
          path={route.path}
          exact={route.exact}
          render={(props) => (
            <Guard>
              <Layout>
                {route.routes ? (
                  renderRoutes(route.routes)
                ) : (
                  <Component {...props} />
                )}
              </Layout>
            </Guard>
          )}
        />
      );
    })}
  </Switch>
);

const routes = [
  {
    exact: true,
    path: '/404',
    component: NotFoundPage,
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/admin',
    guard: AuthGuard,
    layout: AdminLayout,
    routes: [
      {
        exact: true,
        path: '/admin/users',
        component: AdminUsersPage,
      },
      {
        exact: true,
        path: '/admin/groups',
        component: AdminGroupsPage,
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
  {
    path: '/user',
    guard: AuthGuard,
    layout: UserLayout,
    routes: [
      {
        exact: true,
        path: '/user/dashboard',
        component: UserDashboardPage,
      },
      {
        exact: true,
        path: '/user/settings',
        component: UserSettingsPage,
      },
      {
        exact: true,
        path: '/user/methods',
        component: UserMethodsPage,
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },

  {
    path: '*',
    // layout: UserLayout,
    routes: [
      {
        exact: true,
        path: '/',
        component: HomePage,
        guard: AuthGuard,
      },

      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
];

export default routes;
