import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';

import { HashRouter as Router } from 'react-router-dom';
import './App.global.css';

import routes, { renderRoutes } from './routes';

import Authendication from './utils/authendication';

import { getUserInfo } from './actions/app';
import { stopTradeSuccess, completeMethod } from './actions/wefinex';

const { ipcRenderer } = require('electron');

export default function App() {
  const dispatch = useDispatch();
  const { currentOptions } = useSelector((state) => state.wefinex);

  const handleTradingStatus = (event, data) => {
    if (data.error) {
      notification.error({
        message: 'Lỗi!',
        description: data.message,
      });
    } else {
      notification.success({
        message: 'Thành công!',
        description: data.message,
      });
    }
    if (data.completeMethod) {
      const methods = (currentOptions.methods || []).filter(
        (method) => method !== data.completeMethod
      );
      dispatch(completeMethod(methods));
      if (!methods.length) {
        dispatch(stopTradeSuccess());
      }
    }
    if (data.forceStop) {
      dispatch(stopTradeSuccess());
    }
  };

  useEffect(() => {
    const token = Authendication.getToken();
    if (token) {
      dispatch(getUserInfo());
    }

    ipcRenderer.on('trading-status', handleTradingStatus);
    return () => {
      ipcRenderer.removeListener('trading-status', handleTradingStatus);
    };
  }, []);

  return <Router>{renderRoutes(routes)}</Router>;
}
