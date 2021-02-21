import { put, takeLatest, all, call } from 'redux-saga/effects';

import { UNCAUSE_EXCEPTION } from '../constants/global';
import { GET_STAFFS } from '../constants/team';

import { getStaffsSuccess, getStaffsError } from '../actions/team';

import Request from '../utils/request';

export function* getStaffs(action) {
  const getArticlesApi = 'https://corp.funtap.vn/uncommon/funtap-gt1/index.json';
  try {
    const response = yield call(Request, getArticlesApi);
    if (response.status === 200) {
      yield put(getStaffsSuccess(response.data));
    } else if (response.error && response.error.message) { // eslint-disable-line
      yield put(getStaffsError(response.error.message));
    } else {
      yield put(getStaffsError(UNCAUSE_EXCEPTION));
    }
  } catch (error) {
    console.error(error);
    yield put(getStaffsError(UNCAUSE_EXCEPTION));
  }
}


export default function* rootSaga() {
  yield all([
    yield takeLatest(GET_STAFFS, getStaffs),
  ]);
}
