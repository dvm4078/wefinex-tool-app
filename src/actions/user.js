import * as TYPES from '../constants/user';

export const getUsers = (username, page) => ({
  type: TYPES.GET_USERS,
  username,
  page,
});

export const getUsersSuccess = (users, total) => ({
  type: TYPES.GET_USERS_SUCCESS,
  users,
  total,
});

export const createUser = (user) => ({
  type: TYPES.CREATE_USER,
  user,
});

export const createUserSuccess = (user) => ({
  type: TYPES.CREATE_USER_SUCCESS,
  user,
});

export const updateUser = (userId, user) => ({
  type: TYPES.UPDATE_USER,
  userId,
  user,
});

export const updateUserSuccess = (userId, user) => ({
  type: TYPES.UPDATE_USER_SUCCESS,
  userId,
  user,
});

export const deleteUser = (userId) => ({
  type: TYPES.DELETE_USER,
  userId,
});

export const deleteUserSuccess = (userId) => ({
  type: TYPES.DELETE_USER_SUCCESS,
  userId,
});
