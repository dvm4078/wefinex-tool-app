import * as TYPES from '../constants/history';

const initialState = {
  loading: false,
  error: false,
  logs: [],
  total: 0,
  page: 1,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.GET_HISTORY:
      return {
        ...state,
        page: action.page,
        loading: true,
      };

    case TYPES.GET_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        logs: action.logs,
        total: action.total,
      };

    case TYPES.ON_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };

    default:
      return state;
  }
};

export default userReducer;
