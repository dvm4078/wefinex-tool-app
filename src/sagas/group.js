import { put, takeLatest, select, all, call } from 'redux-saga/effects';
import { notification } from 'antd';

import { GET_GROUPS } from '../constants/group';

import { getGroupsSuccess } from '../actions/group';

import API from './API';
import Authendication from '../utils/authendication';

function* handleGetGroups(action) {
  const accessToken = Authendication.getToken();
  API.instance.setHeaders({
    authorization: accessToken,
  });
  let response = null;
  try {
    response = yield call(API.getGroups);
    if (response.ok) {
      console.log('response', response);
      yield put(getGroupsSuccess(response.data.data.groups));
    } else {
      notification.error({
        message: 'Lỗi!',
        description: response.data.message,
      });
    }
  } catch (error) {
    console.error(error);
    notification.error({
      message: 'Lỗi!',
      description: error.message,
    });
  }
}

export default function* rootSaga() {
  yield all([
    // yield takeLatest(LOGIN, getCareers),
    yield takeLatest(GET_GROUPS, handleGetGroups),
  ]);
}
