import { put, takeLatest, all } from 'redux-saga/effects';
import { notification } from 'antd';

import { START_TRADE, STOP_TRADE } from '../constants/wefinex';

import {
  startTradeSuccess,
  stopTradeSuccess,
  onError,
} from '../actions/wefinex';

const { ipcRenderer } = require('electron');

export function* stopTrade(action) {
  try {
    const stopTradeSync = () => {
      return new Promise((resolve) => {
        ipcRenderer.once('stop-trade-reply', (_, arg) => {
          resolve(arg);
        });
        ipcRenderer.send('stop-trade', {});
      });
    };
    const response = yield stopTradeSync();
    if (response.success) {
      notification.success({
        message: 'Thành công!',
        description: 'Đã dừng tự động trade',
      });
      yield put(stopTradeSuccess(response.data));
    } else {
      yield put(onError());
      notification.error({
        message: 'Lỗi!',
        description:
          'Đã có lỗi xảy ra. Vui lòng liên hệ Admin để được trợ giúp!',
      });
    }
  } catch (error) {
    console.error(error);
    yield put(onError());
    notification.error({
      message: 'Lỗi!',
      description: error.message,
    });
  }
}

export function* startTrade(action) {
  try {
    const startTradeSync = () => {
      return new Promise((resolve) => {
        ipcRenderer.once('start-trade-reply', (_, arg) => {
          resolve(arg);
        });
        ipcRenderer.send('start-trade', action.options);
      });
    };
    const response = yield startTradeSync();
    if (response.success) {
      notification.success({
        message: 'Thành công!',
        description: 'Bắt đầu tự động trade',
      });
      yield put(startTradeSuccess(response.data));
    } else {
      yield put(onError());
      notification.error({
        message: 'Lỗi!',
        description:
          'Đã có lỗi xảy ra. Vui lòng liên hệ Admin để được trợ giúp!',
      });
    }
  } catch (error) {
    console.error(error);
    yield put(onError());
    notification.error({
      message: 'Lỗi!',
      description: error.message,
    });
  }
}

export default function* rootSaga() {
  yield all([
    yield takeLatest(START_TRADE, startTrade),
    yield takeLatest(STOP_TRADE, stopTrade),
  ]);
}
