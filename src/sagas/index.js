import { all } from 'redux-saga/effects';
import es6promise from 'es6-promise';

import TeamSaga from './team';
import NewSaga from './new';
import CareerSaga from './career';
import DetailArticleSaga from './detailArticle';
import DetailCareerSaga from './detailCareer';

es6promise.polyfill();

export default function* rootSaga() {
  yield all([
    TeamSaga(),
    NewSaga(),
    CareerSaga(),
    DetailArticleSaga(),
    DetailCareerSaga(),
  ]);
}
