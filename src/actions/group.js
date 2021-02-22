import * as TYPES from '../constants/group';

export const getGroups = () => ({
  type: TYPES.GET_GROUPS,
});

export const getGroupsSuccess = (groups) => ({
  type: TYPES.GET_GROUPS_SUCCESS,
  groups,
});
