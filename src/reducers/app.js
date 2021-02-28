import * as TYPES from '../constants/app';
import { START_TRADE } from '../constants/wefinex';

const initialState = {
  loading: false,
  error: false,
  loggedIn: false,
  user: null,
  loggedInWefinex: false,
  wefinexInfo: null,
  balance: null,
  initialBalance: null,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.LOGOUT:
      return {
        ...initialState,
      };

    case TYPES.UPDATE_PASSWORD:
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

    case TYPES.LOGIN_WEFINEX: {
      return {
        ...state,
        loading: true,
      };
    }

    case TYPES.LOGIN_WEFINEX_SUCCESS: {
      return {
        ...state,
        loading: false,
        wefinexInfo: action.wefinexInfo,
        loggedInWefinex: true,
      };
    }

    case TYPES.GET_USER_INFO_SUCCESS:
      return {
        ...state,
        user: action.user,
        loggedIn: true,
      };

    case TYPES.GET_BALANCE:
      return {
        ...state,
        loading: true,
      };

    case TYPES.GET_BALANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        balance: action.data,
        initialBalance: state.initialBalance || action.data,
      };

    case START_TRADE:
      return {
        ...state,
        balance: null,
        initialBalance: null,
      };

    case TYPES.UPDATE_PASSWORD_SUCCESS:
    case TYPES.ON_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export default appReducer;
