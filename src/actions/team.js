import * as TYPES from '../constants/team';

export const getStaffs = () => ({
  type: TYPES.GET_STAFFS,
});

export const getStaffsSuccess = (staffs) => ({
  type: TYPES.GET_STAFFS_SUCCESS,
  staffs,
});

export const getStaffsError = (errorMessage) => ({
  type: TYPES.GET_STAFFS_ERROR,
  errorMessage,
});
