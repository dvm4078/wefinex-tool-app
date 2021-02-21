import { all } from 'redux-saga/effects';
import es6promise from 'es6-promise';

import AppSaga from './app';
import UserSaga from './user';

es6promise.polyfill();

export default function* rootSaga() {
  yield all([
    AppSaga(),
    UserSaga(),
    // NewSaga(),
    // CareerSaga(),
    // DetailArticleSaga(),
    // DetailCareerSaga(),
  ]);
}
