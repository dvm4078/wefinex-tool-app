import { put, takeLatest, all, call } from 'redux-saga/effects';

import { UNCAUSE_EXCEPTION } from '../constants/global';
import { GET_ARTICLES } from '../constants/new';

import { getArticlesSuccess, getArticlesError } from '../actions/new';

import Request from '../utils/request';

export function* getArticles(action) {
  const queries = Object.keys(action.queries)
    .map((key) => `${key}=${action.queries[key]}`)
    .join('&');
  const getArticlesApi = `https://portal-cmsapi.smobgame.com/api/corp/news?${queries}`;
  try {
    const response = yield call(Request, getArticlesApi);
    if (response.status === 200) {
      // yield put(
      //   getArticlesSuccess(response.data.count, response.data.articles)
      // );
    } else {
      yield put(getArticlesError(UNCAUSE_EXCEPTION));
    }
  } catch (error) {
    console.error(error);
    yield put(getArticlesError(UNCAUSE_EXCEPTION));
  }
}

export default function* rootSaga() {
  yield all([yield takeLatest(GET_ARTICLES, getArticles)]);
}
