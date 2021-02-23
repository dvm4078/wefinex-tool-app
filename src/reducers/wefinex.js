import * as TYPES from '../constants/wefinex';

const initialState = {
  isTrading: false,
  // loading: false,
  // error: false,
  // groups: [],
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.GET_BALANCE:
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
