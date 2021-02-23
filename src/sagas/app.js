import { put, takeLatest, all, call } from 'redux-saga/effects';
import { notification } from 'antd';

import {
  LOGIN,
  GET_USER_INFO,
  UPDATE_PASSWORD,
  GET_BALANCE,
} from '../constants/app';

import {
  loginSuccess,
  getUserInfoSuccess,
  updatePasswordSuccess,
  onError,
  getBalanceSuccess,
} from '../actions/app';

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
      yield put(onError());
      notification.error({
        message: 'Lỗi!',
        description: response.data.message,
      });
    }
  } catch (error) {
    console.error(error);
    yield put(onError());
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
      yield put(onError());
      notification.error({
        message: 'Lỗi!',
        description: response.data.message,
      });
    }
  } catch (error) {
    console.error(error);
    yield put(onError());
    notification.error({
      message: 'Lỗi!',
      description: error.message,
    });
  }
}

export function* updatePassword(action) {
  const accessToken = Authendication.getToken();
  API.instance.setHeaders({
    authorization: accessToken,
  });
  let response = null;
  try {
    response = yield call(API.updatePassword, action.body);
    if (response.ok) {
      console.log('response', response);
      Authendication.saveAuthToCookie(response.data.data.token);
      yield put(updatePasswordSuccess());
      notification.success({
        message: 'Thành công!',
        description: 'Đổi mật khẩu thành công',
      });
    } else {
      yield put(onError());
      notification.error({
        message: 'Lỗi!',
        description: response.data.message,
      });
    }
  } catch (error) {
    console.error(error);
    yield put(onError());
    notification.error({
      message: 'Lỗi!',
      description: error.message,
    });
  }
}

export function* getBalance(action) {
  // const accessToken = Authendication.getToken();
  // API.instance.setHeaders({
  //   authorization: accessToken,
  // });
  // let response = null;
  try {
    // response = yield call(API.updatePassword, action.body);
    // if (response.ok) {
    //   console.log('response', response);
    //   Authendication.saveAuthToCookie(response.data.data.token);
    //   yield put(updatePasswordSuccess());
    //   notification.success({
    //     message: 'Thành công!',
    //     description: 'Đổi mật khẩu thành công',
    //   });
    // } else {
    //   yield put(onError());
    //   notification.error({
    //     message: 'Lỗi!',
    //     description: response.data.message,
    //   });
    // }
  } catch (error) {
    console.error(error);
    yield put(onError());
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
    yield takeLatest(UPDATE_PASSWORD, updatePassword),
    yield takeLatest(GET_BALANCE, getBalance),
  ]);
}
