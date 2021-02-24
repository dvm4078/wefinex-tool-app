import { combineReducers } from 'redux';

import appReducer from './app';
import userReducer from './user';
import groupReducer from './group';
import wefinexReducer from './wefinex';

export default function createReducer() {
  const rootReducer = combineReducers({
    app: appReducer,
    user: userReducer,
    group: groupReducer,
    wefinex: wefinexReducer,
  });

  return rootReducer;
}
