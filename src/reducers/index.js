import { combineReducers } from 'redux';

import appReducer from './app';
import userReducer from './user';
import groupReducer from './group';

export default function createReducer() {
  const rootReducer = combineReducers({
    app: appReducer,
    user: userReducer,
    group: groupReducer,
  });

  return rootReducer;
}
