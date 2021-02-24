import * as TYPES from '../constants/wefinex';

const initialState = {
  isTrading: false,
  loading: false,
  // error: false,
  // groups: [],
};

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.START_TRADE:
      return {
        ...state,
        loading: true,
      };

    case TYPES.START_TRADE_SUCCESS:
      return {
        ...state,
        loading: false,
        isTrading: true,
      };

    case TYPES.STOP_TRADE:
      return {
        ...state,
        loading: true,
      };

    case TYPES.STOP_TRADE_SUCCESS:
      return {
        ...state,
        loading: false,
        isTrading: false,
      };

    case TYPES.ON_ERROR:
      return {
        ...state,
        loading: false,
        isTrading: false,
      };

    default:
      return state;
  }
};

export default groupReducer;
