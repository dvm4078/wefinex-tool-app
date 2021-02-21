import { put, takeLatest, select, all, call } from 'redux-saga/effects';
import { notification } from 'antd';

import {
  GET_USERS,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
} from '../constants/user';

import {
  getUsers,
  getUsersSuccess,
  createUserSuccess,
  updateUserSuccess,
  deleteUserSuccess,
} from '../actions/user';

import API from './API';
import Authendication from '../utils/authendication';

function* handleGetUsers(action) {
  const accessToken = Authendication.getToken();
  API.instance.setHeaders({
    authorization: accessToken,
  });
  let response = null;
  try {
    response = yield call(API.getUsers, {
      username: action.username,
      page: action.page,
      limit: 5,
    });
    if (response.ok) {
      console.log('response', response);
      yield put(
        getUsersSuccess(response.data.data.users, response.data.data.count)
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

function* handleCreateUser(action) {
  const accessToken = Authendication.getToken();
  API.instance.setHeaders({
    authorization: accessToken,
  });
  let response = null;
  try {
    response = yield call(API.createUser, action.user);
    if (response.ok) {
      const page = yield select((state) => state.user.page);
      yield put(getUsers('', page));
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

function* handleUpdateUser(action) {
  const accessToken = Authendication.getToken();
  API.instance.setHeaders({
    authorization: accessToken,
  });
  let response = null;
  try {
    response = yield call(API.updateUser, {
      userId: action.userId,
      body: action.user,
    });
    if (response.ok) {
      const page = yield select((state) => state.user.page);
      yield put(getUsers('', page));
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

function* handleDeleteUser(action) {
  const accessToken = Authendication.getToken();
  API.instance.setHeaders({
    authorization: accessToken,
  });
  let response = null;
  try {
    response = yield call(API.deleteUser, action.userId);
    if (response.ok) {
      const page = yield select((state) => state.user.page);
      yield put(getUsers('', page));
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
    yield takeLatest(GET_USERS, handleGetUsers),
    yield takeLatest(CREATE_USER, handleCreateUser),
    yield takeLatest(UPDATE_USER, handleUpdateUser),
    yield takeLatest(DELETE_USER, handleDeleteUser),
  ]);
}
