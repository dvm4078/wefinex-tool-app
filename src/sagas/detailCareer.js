import { put, takeLatest, all, call } from 'redux-saga/effects';

import { UNCAUSE_EXCEPTION } from '../constants/global';
import { GET_CAREER } from '../constants/detailCareer';

import { getCareerSuccess, getCareerError } from '../actions/detailCareer';

import Request from '../utils/request';

export function* getCarrer(action) {
  const getCarrerApi = `https://portal-cmsapi.smobgame.com/api/corp/recruitment/${action.careerAlias}?website=62`;
  try {
    const response = yield call(Request, getCarrerApi);
    if (response.status === 200) {
      yield put(getCareerSuccess(response.data));
    } else if (response.error && response.error.message) { // eslint-disable-line
      yield put(getCareerError(response.error.message));
    } else {
      yield put(getCareerError(UNCAUSE_EXCEPTION));
    }
  } catch (error) {
    console.error(error);
    yield put(getCareerError(UNCAUSE_EXCEPTION));
  }
}


export default function* rootSaga() {
  yield all([
    yield takeLatest(GET_CAREER, getCarrer),
  ]);
}
