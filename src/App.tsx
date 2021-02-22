import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { HashRouter as Router } from 'react-router-dom';
import './App.global.css';

import routes, { renderRoutes } from './routes';

import Authendication from './utils/authendication';

import { getUserInfo } from './actions/app';

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = Authendication.getToken();
    if (token) {
      dispatch(getUserInfo());
    }
  }, []);

  return <Router>{renderRoutes(routes)}</Router>;
}
