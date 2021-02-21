import { combineReducers } from 'redux';

import appReducer from './app';
import userReducer from './user';

export default function createReducer() {
  const rootReducer = combineReducers({
    app: appReducer,
    user: userReducer,
  });

  return rootReducer;
}
