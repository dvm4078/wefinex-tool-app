import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { notification } from 'antd';

import { HashRouter as Router } from 'react-router-dom';
import './App.global.css';

import routes, { renderRoutes } from './routes';

import Authendication from './utils/authendication';

import { getUserInfo } from './actions/app';
import { stopTradeSuccess } from './actions/wefinex';

const { ipcRenderer } = require('electron');

export default function App() {
  const dispatch = useDispatch();

  const handleTradingError = (event, message) => {
    dispatch(stopTradeSuccess());
    notification.error({
      message: 'Lỗi!',
      description: message,
    });
  };

  useEffect(() => {
    const token = Authendication.getToken();
    if (token) {
      dispatch(getUserInfo());
    }

    ipcRenderer.on('trading-error', handleTradingError);
    return () => {
      ipcRenderer.removeListener('trading-error', handleTradingError);
    };
  }, []);

  return <Router>{renderRoutes(routes)}</Router>;
}
