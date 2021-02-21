import { put, takeLatest, all, call } from 'redux-saga/effects';
import { notification } from 'antd';

import { LOGIN, GET_USER_INFO } from '../constants/app';

import { loginSuccess, getUserInfoSuccess } from '../actions/app';

import API from './API';
import Authendication from '../utils/authendication';

export function* login(action) {
  let response = null;
  try {
    response = yield call(API.login, action);
    if (response.ok) {
      Authendication.saveAuthToCookie(response.data.data.token);
      console.log('response', response);
      yield put(
        loginSuccess(response.data.data.token, response.data.data.user)
      );
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

export function* getUserInfo(action) {
  const accessToken = Authendication.getToken();
  API.instance.setHeaders({
    authorization: accessToken,
  });
  let response = null;
  try {
    response = yield call(API.getProfile);
    if (response.ok) {
      console.log('response', response);
      yield put(getUserInfoSuccess(response.data.data));
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
    yield takeLatest(LOGIN, login),
    yield takeLatest(GET_USER_INFO, getUserInfo),
  ]);
}
