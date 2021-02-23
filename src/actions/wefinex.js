import * as TYPES from '../constants/wefinex';

export const startTrade = () => ({
  type: TYPES.START_TRADE,
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
