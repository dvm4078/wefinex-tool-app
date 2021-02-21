import React, { Fragment } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// import DashboardLayout from 'layouts/DashboardLayout';
// import MainLayout from 'layouts/MainLayout';

import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import NotFoundPage from './components/NotFoundPage';
// import DashboardPage from 'containers/DashboardPage/Loadable';
// import AccountPage from 'containers/AccountPage/Loadable';
// import UserListPage from 'containers/UserListPage/Loadable';
// import CreateUserPage from 'containers/CreateUserPage/Loadable';
// import ConfigPricePage from 'containers/ConfigPricePage/Loadable';
// import Verify2FaPage from 'containers/Verify2FaPage/Loadable';

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
  // {
  //   path: '/main',
  //   guard: AuthGuard,
  //   // layout: DashboardLayout,
  //   routes: [
  //     {
  //       exact: true,
  //       path: '/main/dashboard',
  //       component: DashboardPage,
  //     },
  //     {
  //       exact: true,
  //       path: '/main/account',
  //       component: AccountPage,
  //     },
  //     {
  //       exact: true,
  //       path: '/main/users',
  //       component: UserListPage,
  //     },
  //     {
  //       exact: true,
  //       path: '/main/users/create',
  //       component: CreateUserPage,
  //     },
  //     {
  //       exact: true,
  //       path: '/main/config/price',
  //       component: ConfigPricePage,
  //     },
  //     {
  //       component: () => <Redirect to="/404" />,
  //     },
  //   ],
  // },

  {
    path: '*',
    // layout: MainLayout,
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
