import { all } from 'redux-saga/effects';
import es6promise from 'es6-promise';

import AppSaga from './app';
import UserSaga from './user';
import GroupSaga from './group';
import WefinexSaga from './wefinex';
import HistorySaga from './history';

es6promise.polyfill();

export default function* rootSaga() {
  yield all([AppSaga(), UserSaga(), GroupSaga(), WefinexSaga(), HistorySaga()]);
}
