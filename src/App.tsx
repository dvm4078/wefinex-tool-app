import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';

import { HashRouter as Router } from 'react-router-dom';
import './App.global.css';

import configureStore from './store';
import routes, { renderRoutes } from './routes';

import Authendication from './utils/authendication';

import { getUserInfo } from './actions/app';

const store = configureStore();

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = Authendication.getToken();
    console.log('token', token);
    if (token) {
      dispatch(getUserInfo());
      // getUserInfo();
    }
    // getGames();
  }, []);

  return (
    // <Provider store={store}>
    <Router>{renderRoutes(routes)}</Router>
    // </Provider>
  );
}
