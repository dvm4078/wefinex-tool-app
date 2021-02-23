import * as TYPES from '../constants/group';

const initialState = {
  loading: false,
  error: false,
  groups: [],
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.GET_GROUPS:
      return {
        ...state,
        loading: true,
      };

    case TYPES.GET_GROUPS_SUCCESS:
      return {
        ...state,
        loading: false,
        groups: [...action.groups],
      };

    default:
      return state;
  }
};

export default groupReducer;
