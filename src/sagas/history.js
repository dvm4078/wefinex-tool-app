import { put, takeLatest, select, all, call } from 'redux-saga/effects';
import { notification } from 'antd';

import { GET_HISTORY } from '../constants/history';

import { getHistorySuccess, onError } from '../actions/history';

const { ipcRenderer } = require('electron');

function* handleGetHistory(action) {
  try {
    const username = yield select((state) => (state.app.wefinexInfo || {}).nn);
    const getHistorySync = () => {
      return new Promise((resolve) => {
        ipcRenderer.once('get-trading-log-reply', (_, arg) => {
          resolve(arg);
        });
        ipcRenderer.send('get-trading-log', {
          limit: action.limit,
          page: action.page,
          username,
        });
      });
    };
    const response = yield getHistorySync();
    if (response.success) {
      yield put(getHistorySuccess(response.data, response.total));
    } else {
      yield put(onError());
      notification.error({
        message: 'Lỗi!',
        description: response.message,
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
    // yield takeLatest(LOGIN, getCareers),
    yield takeLatest(GET_HISTORY, handleGetHistory),
  ]);
}
