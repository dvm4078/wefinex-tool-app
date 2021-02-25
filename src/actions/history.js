import * as TYPES from '../constants/history';

export const getHistory = (limit, page) => ({
  type: TYPES.GET_HISTORY,
  limit,
  page,
});

export const getHistorySuccess = (logs, total) => ({
  type: TYPES.GET_HISTORY_SUCCESS,
  logs,
  total,
});

export const onError = () => ({
  type: TYPES.ON_ERROR,
});
