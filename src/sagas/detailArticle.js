import { put, takeLatest, all, call } from 'redux-saga/effects';

import { UNCAUSE_EXCEPTION } from '../constants/global';
import { GET_ARTICLE } from '../constants/detailArticle';

import { getArticleSuccess, getArticleError } from '../actions/detailArticle';

import Request from '../utils/request';

export function* getArticle(action) {
  const getArticlesApi = `https://portal-cmsapi.smobgame.com/api/corp/news/${action.articleAlias}?website=62`;
  try {
    const response = yield call(Request, getArticlesApi);
    if (response.status === 200) {
      yield put(getArticleSuccess(response.data));
    } else if (response.error && response.error.message) { // eslint-disable-line
      yield put(getArticleError(response.error.message));
    } else {
      yield put(getArticleError(UNCAUSE_EXCEPTION));
    }
  } catch (error) {
    console.error(error);
    yield put(getArticleError(UNCAUSE_EXCEPTION));
  }
}


export default function* rootSaga() {
  yield all([
    yield takeLatest(GET_ARTICLE, getArticle),
  ]);
}
