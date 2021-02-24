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

export const loginWefinex = (token) => ({
  type: TYPES.LOGIN_WEFINEX,
  token,
});

export const loginWefinexSuccess = (wefinexInfo) => ({
  type: TYPES.LOGIN_WEFINEX_SUCCESS,
  wefinexInfo,
});

export const getUserInfo = () => ({
  type: TYPES.GET_USER_INFO,
});

export const getUserInfoSuccess = (user) => ({
  type: TYPES.GET_USER_INFO_SUCCESS,
  user,
});

export const updatePassword = (body) => ({
  type: TYPES.UPDATE_PASSWORD,
  body,
});

export const updatePasswordSuccess = () => ({
  type: TYPES.UPDATE_PASSWORD_SUCCESS,
});

export const onError = () => ({
  type: TYPES.ON_ERROR,
});

export const getBalance = () => ({
  type: TYPES.GET_BALANCE,
});

export const getBalanceSuccess = (data) => ({
  type: TYPES.GET_BALANCE_SUCCESS,
  data,
});
