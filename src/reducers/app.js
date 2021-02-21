import * as TYPES from '../constants/app';

const initialState = {
  loading: false,
  error: false,
  loggedIn: false,
  loggedInWefinex: false,
  user: null,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.LOGOUT:
      return {
        ...initialState,
      };

    case TYPES.LOGIN:
      return {
        ...state,
        loading: true,
      };

    case TYPES.LOGIN_SUCCESS: {
      return {
        ...state,
        loading: false,
        user: action.user,
        loggedIn: true,
      };
    }

    case TYPES.GET_USER_INFO_SUCCESS:
      return {
        ...state,
        user: action.user,
        loggedIn: true,
      };

    default:
      return state;
  }
};

export default appReducer;
