import { put, takeLatest, all, call } from 'redux-saga/effects';

import { UNCAUSE_EXCEPTION } from '../constants/global';
import { GET_CAREERS } from '../constants/career';

import { getCareersSuccess, getCareersError } from '../actions/career';

import Request from '../utils/request';

export function* getCareers(action) {
  const queries = Object.keys(action.queries).map((key) => `${key}=${action.queries[key]}`).join('&');
  const getCareerssApi = `https://portal-cmsapi.smobgame.com/api/corp/recruitment?${queries}`;
  try {
    const response = yield call(Request, getCareerssApi);
    if (response.status === 200) {
      yield put(getCareersSuccess(response.data.count, response.data.articles));
    } else {
      yield put(getCareersError(UNCAUSE_EXCEPTION));
    }
  } catch (error) {
    console.error(error);
    yield put(getCareersError(UNCAUSE_EXCEPTION));
  }
}


export default function* rootSaga() {
  yield all([
    yield takeLatest(GET_CAREERS, getCareers),
  ]);
}
