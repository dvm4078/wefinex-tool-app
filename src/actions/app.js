import * as TYPES from '../constants/app';

export const logout = () => ({
  type: TYPES.LOGOUT,
});

export const login = (username, password) => ({
  type: TYPES.LOGIN,
  username,
  password,
});

export const loginSuccess = (token, user) => ({
  type: TYPES.LOGIN_SUCCESS,
  token,
  user,
});

export const getUserInfo = () => ({
  type: TYPES.GET_USER_INFO,
});

export const getUserInfoSuccess = (user) => ({
  type: TYPES.GET_USER_INFO_SUCCESS,
  user,
});
