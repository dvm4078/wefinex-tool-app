import { all } from 'redux-saga/effects';
import es6promise from 'es6-promise';

import AppSaga from './app';
import UserSaga from './user';
import GroupSaga from './group';

es6promise.polyfill();

export default function* rootSaga() {
  yield all([
    AppSaga(),
    UserSaga(),
    GroupSaga(),
    // NewSaga(),
    // CareerSaga(),
    // DetailArticleSaga(),
    // DetailCareerSaga(),
  ]);
}
