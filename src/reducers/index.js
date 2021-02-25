import { combineReducers } from 'redux';

import appReducer from './app';
import userReducer from './user';
import groupReducer from './group';
import wefinexReducer from './wefinex';
import historyReducer from './history';

export default function createReducer() {
  const rootReducer = combineReducers({
    app: appReducer,
    user: userReducer,
    group: groupReducer,
    wefinex: wefinexReducer,
    history: historyReducer,
  });

  return rootReducer;
}
