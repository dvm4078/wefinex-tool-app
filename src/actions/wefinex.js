import * as TYPES from '../constants/wefinex';

export const startTrade = (options) => ({
  type: TYPES.START_TRADE,
  options,
});

export const startTradeSuccess = (data) => ({
  type: TYPES.START_TRADE_SUCCESS,
  data,
});

export const stopTrade = () => ({
  type: TYPES.STOP_TRADE,
});

export const stopTradeSuccess = (data) => ({
  type: TYPES.STOP_TRADE_SUCCESS,
  data,
});

export const onError = () => ({
  type: TYPES.ON_ERROR,
});

export const changeOption = (prop, value) => ({
  type: TYPES.CHANGE_OPTION,
  prop,
  value,
});

export const completeMethod = (methods) => ({
  type: TYPES.COMPLETE_METHOD,
  methods,
});
